// This is a direct utility to force initialize courses in Firebase
// Using CommonJS module format for compatibility

// Import Firebase modules
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnKW_2OqySOjLAG9UAnliaNEpk7wQsKt8",
  authDomain: "react-mkp.firebaseapp.com", 
  projectId: "react-mkp",
  storageBucket: "react-mkp.appspot.com",
  messagingSenderId: "454114035153",
  appId: "1:454114035153:web:c5b4909072292a228c0cf0",
  measurementId: "G-JVQVSK2D94"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Course data
const courses = [
  {
    id: 'course-1',
    title: 'Web Development Fundamentals',
    description: 'Learn the core concepts of web development, including HTML, CSS, and JavaScript.',
    coverImage: 'https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1853305_1280.jpg',
    modules: [
      {
        id: 'module-1-1',
        title: 'HTML Basics',
        lessons: [
          {
            id: 'lesson-1-1-1',
            title: 'Introduction to HTML',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Learn the basics of HTML',
            duration: 15
          },
          {
            id: 'lesson-1-1-2',
            title: 'HTML Forms',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Create interactive forms',
            duration: 18
          }
        ],
        quiz: {
          id: 'quiz-1-1',
          title: 'HTML Quiz',
          questions: [
            {
              id: 'q1-1-1',
              text: 'What does HTML stand for?',
              options: [
                { id: 'opt1', text: 'Hyperlinks and Text Markup Language' },
                { id: 'opt2', text: 'Home Tool Markup Language' },
                { id: 'opt3', text: 'Hyper Text Markup Language' },
                { id: 'opt4', text: 'Hyper Transfer Markup Language' }
              ],
              correctOptionId: 'opt3'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-2',
    title: 'React JS Masterclass',
    description: 'Master React JS, the popular JavaScript library for building user interfaces.',
    coverImage: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
    modules: [
      {
        id: 'module-2-1',
        title: 'React Fundamentals',
        lessons: [
          {
            id: 'lesson-2-1-1',
            title: 'Introduction to React',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Learn React basics',
            duration: 20
          }
        ],
        quiz: {
          id: 'quiz-2-1',
          title: 'React Quiz',
          questions: [
            {
              id: 'q2-1-1',
              text: 'What is JSX?',
              options: [
                { id: 'opt1', text: 'A JavaScript extension for UI development' },
                { id: 'opt2', text: 'A JavaScript XML parser' },
                { id: 'opt3', text: 'A JavaScript execution engine' },
                { id: 'opt4', text: 'JavaScript XHR' }
              ],
              correctOptionId: 'opt1'
            }
          ]
        }
      }
    ]
  }
];

// Function to upload courses
async function uploadCourses() {
  console.log('Starting course upload...');
  
  try {
    for (const course of courses) {
      console.log(`Adding course: ${course.title}`);
      await db.collection('courses').doc(course.id).set(course);
    }
    
    console.log('All courses uploaded successfully!');
  } catch (error) {
    console.error('Error uploading courses:', error);
  }
}

// Run the upload
uploadCourses();
