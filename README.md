# MysticMovies_BE (Movie Review and Rating Website Backend)

This repository contains the backend for the Movie Review and Rating website. It is built using Node.js and Express, with MongoDB as the database. This backend handles user authentication, movie reviews, ratings, and file uploads.

## Prerequisites

Before you begin, ensure you have met the following requirements:
1. You have installed Node.js and npm.
2. You have a running instance of MongoDB (locally or a cloud-based service like MongoDB Atlas).

## Installation

1. Clone the repository:
    ```bash
    git clone <your-repo-url>
    cd <your-repo-directory>
    ```

2. Install the required packages:
    ```bash
    npm install
    ```

## Packages

The following packages are used in this project:

1. **Express**: Web framework for Node.js.
    ```bash
    npx express-generator
    ```

2. **Mongoose**: For interacting with MongoDB.
    ```bash
    npm i mongoose
    ```

3. **Cors**: For enabling Cross-Origin Resource Sharing.
    ```bash
    npm i cors
    ```

4. **JWT (JSON Web Token)**: For handling authentication.
    ```bash
    npm i jsonwebtoken
    ```

5. **Bcrypt**: For hashing passwords.
    ```bash
    npm i bcrypt
    ```

6. **Nodemon**: For automatically restarting the server during development.
    ```bash
    npm i nodemon
    ```

7. **Multer**: For handling file uploads.
    ```bash
    npm i multer
    ```

8. **dotenv**: For managing environment variables.
    ```bash
    npm i dotenv
    ```

## Usage

1. Create a `.env` file in the root directory and add your environment variables. For example:
    ```plaintext
    PORT=5000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ```

2. Start the server:
    ```bash
    npm start
    ```

## Acknowledgments

- Thanks to all the contributors of open-source packages used in this project.



