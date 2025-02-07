# Recipe Management Application

A server-side rendered web application for managing cooking recipes, built with Node.js, Express, and MongoDB. This application allows users to create, share, and review recipes, with role-based access control for managing content.

## Features

### User Authentication
- Register and log in with email and password
- JWT-based authentication for secure access
- Guest and user roles for recipe creation

### Recipe Management
- Create, read, update, and delete recipes
- Upload recipe images using GridFS
- Categorize recipes by difficulty and meal type (e.g., Breakfast, Lunch, Dinner)
- Add ingredients and step-by-step instructions

### Reviews and Ratings
- Users can leave reviews and ratings for recipes
- Average rating calculation for each recipe
- Users can edit or delete their own reviews

### User Profiles
- View and edit user profiles
- Add a bio, profile picture, location, and social media links
- Track recipes created by the user

### Role-Based Access Control
- Users can only edit or delete their own recipes and reviews
- Guests can create recipes but cannot edit or delete them

### Server-Side Rendering
- Dynamic content rendering with EJS templates
- Responsive and modern UI design

### Additional Features
- Dark/Light mode toggle for better user experience
- Request logging with Morgan
- Environment variable configuration with dotenv

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- GridFS for image storage

### Frontend
- EJS (Embedded JavaScript templates)
- CSS for styling
- JavaScript for interactivity

### Utilities
- Morgan (HTTP request logger)
- dotenv (Environment configuration)
- bcryptjs (Password hashing)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Njahi98/Recipe-Management-Application.git
cd Recipe-Management-Application
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```
dbURI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the application:
```bash
node app.js
```

The application will be available at http://localhost:3000.

## Project Structure
```
recipe-nodejs-app/
├── public/            # Static files (CSS, images, scripts)
├── views/             # EJS templates for server-side rendering
│   ├── partials/      # Reusable components (e.g., header, footer)
│   ├── auth/          # Authentication-related pages (login, register)
│   ├── profile/       # User profile pages
│   └── recipes/       # Recipe-related pages
├── models/            # MongoDB models (Recipe, User)
├── routes/            # Route handlers
│   ├── auth.js        # Authentication routes
│   ├── recipeRoutes.js # Recipe-related routes
│   └── profileRoutes.js # Profile-related routes
├── middleware/        # Custom middleware (e.g., auth, isRecipeOwner)
├── app.js             # Application entry point
├── package.json       # Project configuration
└── .env               # Environment variables
```

## Routes

### Authentication
- `GET /auth/login` - Render login page
- `POST /auth/login` - Log in a user
- `GET /auth/register` - Render registration page
- `POST /auth/register` - Register a new user
- `GET /auth/logout` - Log out a user

### Recipes
- `GET /recipes` - View all recipes
- `GET /recipes/:id` - View a specific recipe
- `POST /recipes` - Create a new recipe (protected)
- `PUT /recipes/:id` - Update a recipe (protected)
- `DELETE /recipes/:id` - Delete a recipe (protected)

### Reviews
- `POST /recipes/:id/reviews` - Add a review to a recipe (protected)
- `PUT /recipes/:recipeId/reviews/:reviewId` - Update a review (protected)
- `DELETE /recipes/:recipeId/reviews/:reviewId` - Delete a review (protected)

### Profiles
- `GET /profile/:id` - View a user's profile
- `PUT /profile/:id` - Update a user's profile (protected)

## Usage

### Register or Log In
- Register a new account or log in to an existing one
- Guests can create recipes but cannot edit or delete them

### Create a Recipe
- Fill out the recipe form with a title, description, ingredients, instructions, and an image
- Categorize the recipe by difficulty and meal type

### Manage Recipes
- View all recipes on the homepage
- Click on a recipe to view details, including reviews and ratings
- Edit or delete your own recipes

### Leave Reviews
- Logged-in users can leave reviews and ratings for recipes
- Edit or delete your own reviews

### Update Your Profile
- Add a bio, profile picture, location, and social media links
- Track the recipes you've created
