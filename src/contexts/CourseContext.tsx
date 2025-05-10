import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './AuthContext';

interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  description: string;
  duration: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz: Quiz;
}

interface Course {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  modules: Module[];
}

interface UserProgress {
  completedLessons: { [lessonId: string]: boolean };
  quizScores: { [quizId: string]: number };
  lastAccessed: { courseId: string; moduleId: string; lessonId: string };
}

interface CourseContextType {
  courses: Course[];
  userProgress: UserProgress | null;
  loading: boolean;
  markLessonCompleted: (courseId: string, lessonId: string) => Promise<void>;
  saveQuizScore: (courseId: string, quizId: string, score: number) => Promise<void>;
  updateLastAccessed: (courseId: string, moduleId: string, lessonId: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | null>(null);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

export const CourseProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Fetching courses from Firestore...');
        const coursesCollection = collection(db, 'courses');
        const coursesSnapshot = await getDocs(coursesCollection);
        console.log(`Found ${coursesSnapshot.docs.length} courses`);
        const coursesList = coursesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        setCourses(coursesList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!currentUser) {
        setUserProgress(null);
        setLoading(false);
        return;
      }

      try {
        const userProgressRef = doc(db, 'userProgress', currentUser.uid);
        const userProgressSnapshot = await getDoc(userProgressRef);
        console.log('Fetching user progress for', currentUser.uid);

        if (userProgressSnapshot.exists()) {
          const progress = userProgressSnapshot.data() as UserProgress;
          console.log('User progress found:', progress);
          setUserProgress(progress);
        } else {
          console.log('No existing progress, creating default progress');
          const defaultProgress = {
            completedLessons: {},
            quizScores: {},
            lastAccessed: { courseId: '', moduleId: '', lessonId: '' }
          };
          await setDoc(userProgressRef, defaultProgress);
          console.log('Default progress created');
          setUserProgress(defaultProgress);
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProgress();
  }, [currentUser]);

  const markLessonCompleted = async (courseId: string, lessonId: string) => {
    if (!currentUser || !userProgress) {
      console.error("Cannot mark lesson as completed: no current user or user progress");
      return;
    }

    console.log(`In markLessonCompleted: courseId=${courseId}, lessonId=${lessonId}`);
    console.log("Current user progress:", userProgress);

    try {
      const updatedCompletedLessons = {
        ...userProgress.completedLessons,
        [lessonId]: true
      };
      
      console.log("Updating completedLessons to:", updatedCompletedLessons);

      const userProgressRef = doc(db, 'userProgress', currentUser.uid);
      try {
        await updateDoc(userProgressRef, {
          completedLessons: updatedCompletedLessons
        });
        
        console.log("Firebase update successful");
        
        // Update local state AFTER Firebase update succeeds
        setUserProgress({
          ...userProgress,
          completedLessons: updatedCompletedLessons
        });
        
        console.log("Local state updated with new completedLessons");
      } catch (error) {
        console.error("Firebase update failed:", error);
        
        // Check if it's because the document doesn't exist
        if ((error as any).code === 'not-found') {
          console.log("User progress document not found, creating it...");
          const defaultProgress = {
            completedLessons: { [lessonId]: true },
            quizScores: {},
            lastAccessed: { courseId, moduleId: '', lessonId: '' }
          };
          
          await setDoc(userProgressRef, defaultProgress);
          setUserProgress(defaultProgress);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
      throw error;
    }
  };

  const saveQuizScore = async (courseId: string, quizId: string, score: number) => {
    if (!currentUser || !userProgress) {
      console.warn('Cannot save quiz score: no user logged in or no user progress');
      return;
    }

    try {
      console.log(`Saving quiz score: ${score} for quiz ${quizId}`);
      
      const updatedQuizScores = {
        ...userProgress.quizScores,
        [quizId]: Math.max(userProgress.quizScores[quizId] || 0, score)
      };
      
      console.log('Updated quiz scores object:', updatedQuizScores);

      const userProgressRef = doc(db, 'userProgress', currentUser.uid);
      try {
        await updateDoc(userProgressRef, {
          quizScores: updatedQuizScores
        });
        
        console.log('Firebase quiz score update successful');
        
        // Update local state AFTER Firebase update succeeds
        setUserProgress({
          ...userProgress,
          quizScores: updatedQuizScores
        });
      } catch (error) {
        console.error("Firebase quiz update failed:", error);
        
        // Check if it's because the document doesn't exist
        if ((error as any).code === 'not-found') {
          console.log("User progress document not found, creating it for quiz scores...");
          const defaultProgress = {
            completedLessons: {},
            quizScores: { [quizId]: score },
            lastAccessed: { courseId, moduleId: '', lessonId: '' }
          };
          
          await setDoc(userProgressRef, defaultProgress);
          setUserProgress(defaultProgress);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error saving quiz score:', error);
    }
  };

  const updateLastAccessed = async (courseId: string, moduleId: string, lessonId: string) => {
    if (!currentUser || !userProgress) {
      console.warn("Cannot update last accessed: no user logged in or no user progress");
      return;
    }
    
    console.log(`Updating last accessed: courseId=${courseId}, moduleId=${moduleId}, lessonId=${lessonId}`);

    try {
      const lastAccessed = { courseId, moduleId, lessonId };

      const userProgressRef = doc(db, 'userProgress', currentUser.uid);
      try {
        await updateDoc(userProgressRef, { lastAccessed });
        console.log("Last accessed updated in Firebase successfully");
        
        setUserProgress({
          ...userProgress,
          lastAccessed
        });
      } catch (error: any) {
        console.error("Error updating last accessed in Firebase:", error);
        
        // If document doesn't exist yet, create it
        if (error.code === 'not-found') {
          const defaultProgress = {
            completedLessons: {},
            quizScores: {},
            lastAccessed: { courseId, moduleId, lessonId }
          };
          
          await setDoc(userProgressRef, defaultProgress);
          setUserProgress(defaultProgress);
          console.log("Created new user progress document with last accessed data");
        }
      }
    } catch (error) {
      console.error('Error updating last accessed:', error);
    }
  };

  const value = {
    courses,
    userProgress,
    loading,
    markLessonCompleted,
    saveQuizScore,
    updateLastAccessed
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
