// This is a direct utility to initialize courses in your database
// Run this file directly with "npx ts-node src/utils/forceInitCourses.ts"

import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const courses = [
  {
    id: 'course-1',
    title: 'Web Development Fundamentals',
    description: 'Learn the core concepts of web development, including HTML, CSS, and JavaScript. This course is perfect for beginners who want to start their journey in web development.',
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
            description: 'Learn the basics of HTML, including tags, elements, and document structure.',
            duration: 15
          },
          {
            id: 'lesson-1-1-2',
            title: 'HTML Forms',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Learn how to create interactive forms in HTML to collect user input.',
            duration: 18
          }
        ],
        quiz: {
          id: 'quiz-1-1',
          title: 'HTML Fundamentals Quiz',
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
            },
            {
              id: 'q1-1-2',
              text: 'Which element is used to define the structure of an HTML document?',
              options: [
                { id: 'opt1', text: '<body>' },
                { id: 'opt2', text: '<html>' },
                { id: 'opt3', text: '<structure>' },
                { id: 'opt4', text: '<head>' }
              ],
              correctOptionId: 'opt2'
            }
          ]
        }
      },
      {
        id: 'module-1-2',
        title: 'CSS Fundamentals',
        lessons: [
          {
            id: 'lesson-1-2-1',
            title: 'CSS Selectors',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Learn how to target HTML elements with CSS selectors.',
            duration: 14
          },
          {
            id: 'lesson-1-2-2',
            title: 'CSS Box Model',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Understand the CSS Box Model including margin, border, padding, and content.',
            duration: 12
          }
        ],
        quiz: {
          id: 'quiz-1-2',
          title: 'CSS Fundamentals Quiz',
          questions: [
            {
              id: 'q1-2-1',
              text: 'What does CSS stand for?',
              options: [
                { id: 'opt1', text: 'Creative Style Sheets' },
                { id: 'opt2', text: 'Computer Style Sheets' },
                { id: 'opt3', text: 'Cascading Style Sheets' },
                { id: 'opt4', text: 'Colorful Style Sheets' }
              ],
              correctOptionId: 'opt3'
            },
            {
              id: 'q1-2-2',
              text: 'Which property is used to change the background color?',
              options: [
                { id: 'opt1', text: 'color' },
                { id: 'opt2', text: 'bgcolor' },
                { id: 'opt3', text: 'background-color' },
                { id: 'opt4', text: 'background' }
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
            description: 'Learn the core concepts of React, including components, JSX, and the virtual DOM.',
            duration: 20
          }
        ],
        quiz: {
          id: 'quiz-2-1',
          title: 'React Basics Quiz',
          questions: [
            {
              id: 'q2-1-1',
              text: 'What is JSX?',
              options: [
                { id: 'opt1', text: 'A JavaScript extension for UI development' },
                { id: 'opt2', text: 'A JavaScript XML parser' },
                { id: 'opt3', text: 'A JavaScript execution engine' },
                { id: 'opt4', text: 'JavaScript XHR (XMLHttpRequest)' }
              ],
              correctOptionId: 'opt1'
            }
          ]
        }
      }
    ]
  },
  {
    id: 'course-3',
    title: 'Advanced JavaScript',
    description: 'Take your JavaScript skills to the next level with this advanced course.',
    coverImage: 'https://cdn.pixabay.com/photo/2015/04/23/17/41/javascript-736400_1280.png',
    modules: [
      {
        id: 'module-3-1',
        title: 'ES6+ Features',
        lessons: [
          {
            id: 'lesson-3-1-1',
            title: 'Arrow Functions and Template Literals',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            description: 'Learn ES6 arrow functions and template literals.',
            duration: 18
          }
        ],
        quiz: {
          id: 'quiz-3-1',
          title: 'Modern JavaScript Quiz',
          questions: [
            {
              id: 'q3-1-1',
              text: 'What is the correct syntax for an arrow function?',
              options: [
                { id: 'opt1', text: 'function = () => {}' },
                { id: 'opt2', text: '() => {}' },
                { id: 'opt3', text: '=> () {}' },
                { id: 'opt4', text: 'function => () {}' }
              ],
              correctOptionId: 'opt2'
            }
          ]
        }
      }
    ]
  }
];

async function uploadCourses() {
  console.log('Starting direct course upload...');

  try {
    // First check if we have any courses
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    
    if (!coursesSnapshot.empty) {
      console.log('Courses already exist in the database. Skipping upload.');
      return;
    }
    
    // Upload all courses
    for (const course of courses) {
      console.log(`Uploading course: ${course.title}`);
      await setDoc(doc(db, 'courses', course.id), course);
    }
    
    console.log('All courses uploaded successfully!');
  } catch (error) {
    console.error('Error uploading courses:', error);
  }
}

// Execute the upload
uploadCourses();
