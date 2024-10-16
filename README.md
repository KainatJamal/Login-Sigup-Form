# Login-Signup Application

This is a React-based login and signup application integrated with Firebase authentication. The app allows users to sign up with email and password or sign in using their Google account. It also includes a home page that greets users after successful login or signup.

## Features

- **Sign Up with Email and Password**: Users can create an account by providing their first name, last name, email, and password.
- **Login with Email and Password**: Users can log in using the email and password they registered with.
- **Google Sign-In**: Users can sign up or log in using their Google account.
- **Password Visibility Toggle**: Show/hide password feature for ease of use.
- **Form Validation**: Password confirmation check during signup.
- **Home Page**: A welcoming home page after logging in.

## Technologies Used

- **React.js**: For building the user interface.
- **Firebase Authentication**: For user authentication.
- **Firebase Firestore**: For storing user details (name, email, etc.).
- **React Router**: For navigating between different pages (Login, Signup, Home).
- **CSS**: For styling the components.

## Usage
 - On the signup page, fill in your details and click "Sign Up" to create an account.
 - After signup, you will be redirected to the home page.
 - On the login page, you can log in with your email and password or use Google to sign in.

## Firebase Configuration
You need to set up Firebase for this project. Go to the Firebase Console, create a new project, and get the config details for your app. Replace the placeholders in the firebase.js file with your Firebase credentials.
