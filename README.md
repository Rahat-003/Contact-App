# Contact App
This is a Contact Management application built using Node.js and Express.js. This app allows users to manage a list of contacts including creating, updating, viewing, and deleting contacts. The application uses JWT for authentication and MongoDB as the database.
Additionally, the app provides functionality for authenticated users to import and export their contact data from and to a JSON file, allowing easy backup and data transfer.

## Features

- User authentication using JWT (JSON Web Token)
- CRUD operations for managing contacts
- Validation for user inputs
- Error handling and logging
- Importing and exporting contacts to JSON
- Secured API routes
- MongoDB for database storage
- APIs for adding dummy user and contact data to the database for load testing with large document sizes.


## Technologies

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB
- **bcrypt.js**: Password hashing
- **JWT (JSON Web Token)**: For authentication, with built-in support for token expiration (timeout) to enhance security.
- **MongoDB**: Database for storing user and contact data


# Project Dependencies

This project requires the following tools and technologies:

- [Node.js](https://nodejs.org/) (v20 or higher): Node.js is a JavaScript runtime used to run the backend code for the project.
- [MongoDB](https://www.mongodb.com/) (v4 or higher): MongoDB is a NoSQL database used for storing the application's data.
- [MongoDB Compass](https://www.mongodb.com/products/compass) (optional): MongoDB Compass is a GUI tool for interacting with the MongoDB database, allowing you to view and manage data.
- [Postman](https://www.postman.com/) (optional): Postman is a tool for testing and interacting with the API during development.


## Installation

1. Clone the repository:
   ```bash
   # Using HTTPS
   git clone https://github.com/Rahat-003/Contact-App.git
   cd Contact-App
   ```
   ```bash
   # Using SSH
   git clone git@github.com:Rahat-003/Contact-App.git
   cd Contact-App
   ```
2. Install packages:
    ```bash
    npm i
    ```
3. Run the app
    ```bash
    npm run dev
    ```
## Inserting Dummy Data

This feature is specifically designed for testing purposes, such as load testing with large datasets. Follow the steps below to use the dummy data insertion feature via Postman:

### Steps:

1. **Import API Collection**: 
   - First, import the `Contact-App-APIs.postman_collection.json` collection into Postman.

2. **Create Users**:
   - You can either manually create users using the user registration API or visit `/user/home` to generate some initial users in postman.

3. **Insert Dummy Users**:
   - Locate the `insertDummyUser` request in the Postman collection.
   - Send the request to insert `~500` dummy users into the database.

4. **Insert Dummy Contacts**:
   - Locate the `insertDummyContact` request in the Postman collection.
   - Send the request to insert `~300000` dummy contacts associated with the created users.

5. **Testing with Data**:
   - Once you have populated the database with sufficient dummy user and contact data, you can use the other API endpoints to test and analyze performance.


**Important**: Make sure to use the token found in the login or signup response and include it in the Authorization header (Bearer token) when making requests to other protected endpoints.

For ease, a script has been added in the `auth` folder inside postman which will automatically save the authenticated token, allowing you to easily use it in other secured API requests.

