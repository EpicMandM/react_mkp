# React E-Learning Platform

A modern e-learning platform built with React, TypeScript, and Firebase. This application allows users to browse courses, watch video lessons, take quizzes, and track their learning progress.

## Features

- **User Authentication**: Sign up, login, and profile management using Firebase Authentication
- **Course Catalog**: Browse available courses with detailed descriptions
- **Video Lessons**: Watch embedded video lessons with tracking and progress indicators
- **Interactive Quizzes**: Take quizzes after completing modules to test your knowledge
- **Progress Tracking**: Track your progress through courses, completed lessons, and quiz scores
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later)
- [npm](https://www.npmjs.com/) (v6.x or later) or [yarn](https://yarnpkg.com/)
- A [Firebase](https://firebase.google.com/) account for backend services

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/EpicMandM/react-mkp.git
cd react-mkp
```

### 2. Install dependencies

```bash
npm install
```
or if you're using yarn:
```bash
yarn install
```

### 3. Set up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use an existing one)
3. Enable **Authentication** (with Email/Password provider) and **Firestore Database**
4. In the project settings, add a new web app
5. Copy the Firebase configuration object

### 4. Configure the application

Create a `.env` file in the root directory with your Firebase credentials:

```
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

Alternatively, you can directly update the Firebase configuration in `src/services/firebase.ts`.

### 5. Initialize the database

To populate the database with initial course data:

```bash
npx ts-node src/utils/forceInitCourses.ts
```

or use the alternative script if the TypeScript version has issues:

```bash
node src/utils/force-init.js
```

### 6. Start the development server

```bash
npm start
```

The application should now be running at http://localhost:3000

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
