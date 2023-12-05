# Brewery Review Web App
This is a web application designed to allow users to search for breweries, view details about them, and leave reviews. Users can sign up, log in, search for breweries by city, name, or type, and access detailed information about individual breweries, including reviews left by other users.

## Features

- **User Authentication**: Users can sign up using a unique username and password. Duplicate usernames are not permitted. Once signed up, users can log in to access the main functionalities of the app.
- **Brewery Search**: Users have the ability to search for breweries by city, name, or type. The search functionality supports pagination for managing large datasets efficiently.
- **Brewery Detail Page**: Clicking on a specific brewery displays comprehensive information about that brewery, including reviews submitted by other users. Users can also leave their own ratings and comments for a brewery.
- **Navigation**: The application includes a navigation bar showing the logged-in user's name, along with buttons for navigating to the home page and logging out.

## Tech Stack

### Frontend
- React.js
- JavaScript
- TailwindCSS
- Axios

### Backend
- Express.js
- MongoDB
- Mongoose
- CORS
- Axios

## Setup Instructions

1. Clone this repository.
2. Install dependencies for both the frontend and backend components.
3. Configure environment variables required for MongoDB connection and other necessary settings.
4. Start the backend server.
5. Launch the frontend development server.
6. Access the application using the provided URL.


## How to Run the Project Locally

1. Clone this repository to your local machine.
2. Install required modules:

### For Server

```bash
cd ./server/
npm install
npm start
```

### For Client

```bash
cd ./client/
npm install
npm start
```

## Note : 
Before running, ensure you have MongoDB installed and running locally. Check for the MONGO_URI in the local machine, create a database named "breweryReviewsDB" with a collections named "users" and "reviews".
Once the installations and configurations are completed, execute the project.

--> Now, the application is ready to use! Open your web browser and access the application.


## Demo Video Link : 
[Link](https://drive.google.com/file/d/1jruvxnF_260R27kQVXrmMokiNbxyKgow/view?usp=sharing)
