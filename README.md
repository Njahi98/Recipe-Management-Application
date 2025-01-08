# Recipe Management Application

A server-side rendered web application for managing cooking recipes built with Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete recipes
- Server-side rendering with EJS templates for dynamic content display
- Request logging with Morgan
- Static file serving for CSS and images
- Environment variable configuration for database connection

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS (Embedded JavaScript templates)
- Morgan (HTTP request logger)
- dotenv (Environment configuration)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Njahi98/Recipe-Nodejs-App.git
cd recipe-nodejs-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
dbURI=your_mongodb_connection_string
```

4. Start the application:
```bash
node app.js
```

The application will be available at `http://localhost:3000`

## Project Structure

```
recipe-nodejs-app/
├── public/          # Static files (CSS, images)
├── views/           # EJS templates for server-side rendering
├── routes/          # Route handlers
├── app.js          # Application entry point
├── package.json    # Project configuration
└── .env           # Environment variables
```

## Routes

- `GET /` - Home page
- `GET /about` - About page
- `GET /contact` - Contact page
- `GET /recipes` - View all recipes
- `POST /recipes` - Create a new recipe
- `GET /recipes/:id` - View a specific recipe
- `PUT /recipes/:id` - Update a recipe
- `DELETE /recipes/:id` - Delete a recipe

