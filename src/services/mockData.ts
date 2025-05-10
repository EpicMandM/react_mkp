import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

// This function checks if the courses already exist in Firebase
const coursesExist = async (): Promise<boolean> => {
  try {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    return !coursesSnapshot.empty;
  } catch (error) {
    console.error('Error checking for existing courses:', error);
    return false;
  }
};

// This function resets the database (useful for testing)
export const resetDatabase = async (): Promise<void> => {
  try {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    
    const deletionPromises = coursesSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletionPromises);
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};

// Main function to initialize mock data
export const initializeData = async (): Promise<void> => {
  // Check if data already exists
  const dataExists = await coursesExist();
  
  if (dataExists) {
    console.log('Mock data already initialized, skipping...');
    return;
  }
  
  console.log('Initializing mock data...');
  // Static mock course data array
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
              description: 'Learn the basics of HTML, including tags, elements, and document structure. This lesson covers the fundamental building blocks of web pages.',
              duration: 15
            },
            {
              id: 'lesson-1-1-2',
              title: 'HTML Forms',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Learn how to create interactive forms in HTML to collect user input. This lesson covers form elements, validation, and submission.',
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
              description: 'Learn how to target HTML elements with CSS selectors. This lesson covers different types of selectors and their specificity.',
              duration: 14
            },
            {
              id: 'lesson-1-2-2',
              title: 'CSS Box Model',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Understand the CSS Box Model including margin, border, padding, and content. This lesson is essential for layout management in web design.',
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
      description: 'Master React JS, the popular JavaScript library for building user interfaces. This comprehensive course covers everything from the basics to advanced concepts.',
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
              description: 'Learn the core concepts of React, including components, JSX, and the virtual DOM. This lesson provides a solid foundation for React development.',
              duration: 20
            },
            {
              id: 'lesson-2-1-2',
              title: 'State and Props',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Understand how to manage data in React components using state and props. This lesson covers data flow and component communication patterns.',
              duration: 22
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
              },
              {
                id: 'q2-1-2',
                text: 'In React, which hook is used to add state to a functional component?',
                options: [
                  { id: 'opt1', text: 'useComponent' },
                  { id: 'opt2', text: 'useState' },
                  { id: 'opt3', text: 'useReact' },
                  { id: 'opt4', text: 'useStateful' }
                ],
                correctOptionId: 'opt2'
              }
            ]
          }
        },
        {
          id: 'module-2-2',
          title: 'React Hooks',
          lessons: [
            {
              id: 'lesson-2-2-1',
              title: 'useState and useEffect',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Learn about the two most commonly used React hooks: useState for state management and useEffect for side effects. This lesson covers practical use cases.',
              duration: 19
            },
            {
              id: 'lesson-2-2-2',
              title: 'Custom Hooks',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Learn how to create reusable logic with custom hooks. This lesson shows how to abstract complex functionality into shareable hooks.',
              duration: 16
            }
          ],
          quiz: {
            id: 'quiz-2-2',
            title: 'React Hooks Quiz',
            questions: [
              {
                id: 'q2-2-1',
                text: 'What is the purpose of useEffect?',
                options: [
                  { id: 'opt1', text: 'To handle side effects in function components' },
                  { id: 'opt2', text: 'To create custom event handlers' },
                  { id: 'opt3', text: 'To optimize rendering performance' },
                  { id: 'opt4', text: 'To connect to a Redux store' }
                ],
                correctOptionId: 'opt1'
              },
              {
                id: 'q2-2-2',
                text: 'When does useEffect run by default?',
                options: [
                  { id: 'opt1', text: 'Only on component mount' },
                  { id: 'opt2', text: 'Only when specified props change' },
                  { id: 'opt3', text: 'After every render' },
                  { id: 'opt4', text: 'Before the component renders' }
                ],
                correctOptionId: 'opt3'
              }
            ]
          }
        }
      ]
    },
    {
      id: 'course-3',
      title: 'Advanced JavaScript',
      description: 'Take your JavaScript skills to the next level with this advanced course. Learn modern ES6+ features, asynchronous programming, and design patterns.',
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
              description: 'Learn ES6 arrow functions and template literals, which make JavaScript code more concise and readable. This lesson covers syntax and practical examples.',
              duration: 18
            },
            {
              id: 'lesson-3-1-2',
              title: 'Destructuring and Spread Operators',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Master destructuring assignments and spread operators, powerful ES6 features for working with arrays and objects. This lesson includes common use cases.',
              duration: 15
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
              },
              {
                id: 'q3-1-2',
                text: 'What does the spread operator do?',
                options: [
                  { id: 'opt1', text: 'It spreads an array into separate arguments' },
                  { id: 'opt2', text: 'It divides numbers into smaller components' },
                  { id: 'opt3', text: 'It expands the scope of variables' },
                  { id: 'opt4', text: 'It spreads functions across modules' }
                ],
                correctOptionId: 'opt1'
              }
            ]
          }
        },
        {
          id: 'module-3-2',
          title: 'Asynchronous JavaScript',
          lessons: [
            {
              id: 'lesson-3-2-1',
              title: 'Promises',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Learn about Promises, a cleaner way to handle asynchronous operations in JavaScript. This lesson covers creating, chaining, and error handling with promises.',
              duration: 22
            },
            {
              id: 'lesson-3-2-2',
              title: 'Async/Await',
              videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
              description: 'Master async/await syntax, which makes asynchronous code look and behave more like synchronous code. This lesson includes error handling and practical patterns.',
              duration: 20
            }
          ],
          quiz: {
            id: 'quiz-3-2',
            title: 'Asynchronous JavaScript Quiz',
            questions: [
              {
                id: 'q3-2-1',
                text: 'What is the purpose of async/await?',
                options: [
                  { id: 'opt1', text: 'To make animations smoother' },
                  { id: 'opt2', text: 'To simplify asynchronous code' },
                  { id: 'opt3', text: 'To create web workers' },
                  { id: 'opt4', text: 'To improve JavaScript performance' }
                ],
                correctOptionId: 'opt2'
              },
              {
                id: 'q3-2-2',
                text: 'Which statement about Promises is true?',
                options: [
                  { id: 'opt1', text: 'Promises can only be resolved, not rejected' },
                  { id: 'opt2', text: 'Promises always execute synchronously' },
                  { id: 'opt3', text: 'Promises represent a value that might be available now, later, or never' },
                  { id: 'opt4', text: 'Promises can only handle one asynchronous operation at a time' }
                ],
                correctOptionId: 'opt3'
              }
            ]
          }
        }
      ]
    }
  ];
  
  // Save courses to Firestore
  console.log('Saving courses to Firestore...');
  try {
    const coursesCollection = collection(db, 'courses');
    
    // Create a batch of write operations
    const savePromises = courses.map(course => 
      setDoc(doc(db, 'courses', course.id), course)
    );
    
    // Execute all writes
    await Promise.all(savePromises);
    console.log('All courses saved successfully!');
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
};
