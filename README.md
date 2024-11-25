
# Google Books Search Engine with GraphQL

This is a Google Books Search Engine application, refactored to use a GraphQL API with Apollo Server. The application is built with the MERN stack (MongoDB, Express.js, React, and Node.js) and allows users to search for books using the Google Books API, save books to their account, and view saved books. While the core functionality is in place, some features like login and saving books to user accounts may have limitations and require further refinement.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Known Issues](#known-issues)
- [Future Improvements](#future-improvements)
- [Deployment](#deployment)

---

## Features
- **Search for Books**: Search for books using the Google Books API.
- **User Authentication**: Login and sign-up functionality with JWT authentication.
- **Save Books**: Authenticated users can save books to their account.
- **View Saved Books**: View a personalized list of saved books.
- **Responsive Design**: Optimized for various devices and screen sizes.
- **GraphQL Integration**: Refactored backend to replace RESTful API with Apollo Server and GraphQL.

---

## Technologies Used
- **Frontend**: React, React Router, Apollo Client, Bootstrap
- **Backend**: Node.js, Express.js, Apollo Server
- **Database**: MongoDB (hosted on MongoDB Atlas)
- **Other Libraries**:
  - `graphql` and `apollo-server-express` for GraphQL API
  - `jsonwebtoken` for authentication
  - `bcrypt` for password hashing
  - `mongoose` for MongoDB object modeling

---

## Getting Started

### Prerequisites
- Node.js (v18.x or higher recommended)
- npm or yarn
- MongoDB Atlas account for database hosting

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/J0263/book-api.git
   ```
2. Navigate to the root of the project:
   ```bash
   cd book-api
   ```

3. Install dependencies for the server:
   ```bash
   cd server
   npm install
   ```
   
4. Install dependencies for the client:
   ```bash
   cd ../client
   npm install
   ```

5. Create an `.env` file in the `server` directory with the following:
   ```plaintext
   JWT_SECRET_KEY=your-secret-key
   DB_URI=mongodb+srv://<username>:<password>@<cluster-url>/googlebooks
   ```

### Running the Application
1. Build the project:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   cd server
   npm start
   ```

3. Start the client:
   ```bash
   cd ../client
   npm run dev
   ```

4. Open the application in your browser at `http://localhost:3000`.

---

## Usage

### Searching for Books
1. Enter a search term in the input field on the home page.
2. Click the "Submit" button to view a list of books.

### User Authentication
1. Click on the "Login/Sign Up" option in the navbar.
2. Use the sign-up form to create an account or log in with existing credentials.

### Saving Books
1. Once logged in, search for books.
2. Click the "Save" button on a book to add it to your saved list.

### Viewing Saved Books
1. Navigate to the "Saved Books" section in the navbar.
2. View all books saved to your account and remove books if needed.

---

## Known Issues
- **Login Functionality**: Occasionally, login may not work as expected due to token handling issues.
- **Saving Books**: Books may not consistently save to the database, especially if there are connectivity issues.
- **Error Messages**: Some error handling and messages may not display detailed information.
- **Validation**: Form validation may need additional improvements for better user experience.

---

## Future Improvements
- Fix login token handling to ensure consistent user authentication.
- Improve the `saveBook` mutation to ensure reliable database operations.
- Enhance error handling and user feedback throughout the application.
- Implement user-friendly modals for error and success notifications.
- Add sorting and filtering options for saved books.

---

## Deployment
This application is deployed using [Render](https://render.com) with a MongoDB Atlas database. The deployed application URL is https://book-api-uu2t.onrender.com

### Build Command
```bash
cd server && npm install && npm run build && cd ../client && npm install && npm run build
```

### Publish Directory
For the client: `client/dist`

Thank you for checking out this project! Contributions and feedback are welcome to help improve functionality and user experience. 🎉
