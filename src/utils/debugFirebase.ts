// This is a helper file for debugging Firebase Firestore interactions
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

/**
 * Debug and repair user progress in Firebase
 * @param userId The user ID to check/repair
 */
export const debugUserProgress = async (userId: string) => {
  try {
    // Check if user progress exists
    console.log(`Checking progress for user ${userId}...`);
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressSnap = await getDoc(userProgressRef);
    
    if (userProgressSnap.exists()) {
      console.log("User progress found:", userProgressSnap.data());
      return userProgressSnap.data();
    } else {
      console.log("No user progress found, creating default...");
      // Create default user progress
      const defaultProgress = {
        completedLessons: {},
        quizScores: {},
        lastAccessed: { courseId: '', moduleId: '', lessonId: '' }
      };
      
      await setDoc(userProgressRef, defaultProgress);
      console.log("Default progress created successfully");
      return defaultProgress;
    }
  } catch (error) {
    console.error("Error debugging user progress:", error);
    throw error;
  }
};

/**
 * Force mark a lesson as completed for debugging
 */
export const forceMarkLessonComplete = async (
  userId: string | undefined, 
  courseId: string, 
  lessonId: string
) => {
  if (!userId) {
    console.error("Cannot mark lesson as completed: no user ID provided");
    return { success: false, error: 'No user ID' };
  }

  console.log(`Force marking lesson ${lessonId} as completed for user ${userId}...`);
  try {
    const userProgressRef = doc(db, 'userProgress', userId);
    const userProgressSnap = await getDoc(userProgressRef);
    
    if (userProgressSnap.exists()) {
      const data = userProgressSnap.data();
      const updatedCompletedLessons = {
        ...data.completedLessons,
        [lessonId]: true
      };
      
      await updateDoc(userProgressRef, {
        completedLessons: updatedCompletedLessons
      });
      
      console.log(`Lesson ${lessonId} marked as completed successfully`);
      return { success: true, data: updatedCompletedLessons };
    } else {
      console.log("No user progress found, creating new...");
      const newProgress = {
        completedLessons: { [lessonId]: true },
        quizScores: {},
        lastAccessed: { courseId, moduleId: '', lessonId }
      };
      
      await setDoc(userProgressRef, newProgress);
      console.log("Created new progress with completed lesson");
      return { success: true, data: newProgress };
    }
  } catch (error) {
    console.error("Error force marking lesson as complete:", error);
    return { success: false, error };
  }
};
