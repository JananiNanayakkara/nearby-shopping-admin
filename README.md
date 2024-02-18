# Project Description

The Nearby Shopping Fullstack project is a fullstack application that allows
users to find nearby shopping locations. It consists of two main components: an
Express backend server and a React Native mobile app.

The Express backend server is responsible for handling API requests and
interacting with the database. It provides endpoints for user authentication,
retrieving nearby shopping locations.
The React Native mobile app serves as the frontend interface for users. It
allows users to search for nearby shopping locations, view details about each
location, and save their favorite locations.

## Setting up the Express Backend

To set up and run the Express backend server locally, follow these steps:

Clone the repository from GitHub: git clone
https://github.com/argonjs/nearby-shopping-fullstack.git Navigate to the project
directory: cd nearby-shopping-fullstack/backend Install the dependencies: npm
install Create a .env file in the root directory and configure the following
environment variables: DB_CONNECTION_STRING: Connection string for your MongoDB
database JWT_SECRET: Secret key for JWT token generation Start the server: npm
start The Express backend server should now be running on http://localhost:3000.

## Setting up the React Native App

To set up and run the React Native app locally, follow these steps:

Navigate to the project directory:

`cd nearby-shopping-fullstack/mobile-app`

Install the dependencies:

`npm install`

Update the API_BASE_URL variable in src/config.js to http://localhost:3000 (or
the URL where your Express backend is running)

Start the Metro bundler:

`npm start`

In a separate terminal, start the app on Android or iOS: Android: npm run
android iOS: npm run ios The React Native app should now be running on your
Android or iOS device/emulator.

Please note that additional setup steps may be required depending on your
development environment and platform. Make sure to consult the project's
documentation for more detailed instructions.

Remember to save your changes.
