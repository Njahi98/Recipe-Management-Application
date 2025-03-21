# Recipe Management Application

A server-side rendered web application for managing cooking recipes, built with Node.js, Express, EJS templates and MongoDB. This application allows users to create, share, and review recipes, with role-based access control for managing content.
Live demo: https://recipe-management-application-1.onrender.com/

## Features

### User Authentication & Roles
- Register and log in with email and password
- JWT-based authentication with secure cookie storage
- Three user types:
  - **Guests**: Can create recipes and leave reviews without an account
  - **Users**: Can create, edit, and delete their own recipes and reviews
  - **Admins**: Have full access to manage all content and users

### Recipe Management
- Create, read, update, and delete recipes
- Upload and store recipe images using GridFS
- Categorize recipes by difficulty (Easy, Medium, Hard) and meal type (Breakfast, Lunch, Dinner, Dessert, Snack)
- Add ingredients and step-by-step instructions
- Track cooking time for each recipe

### Reviews and Ratings
- Leave reviews and ratings (1-5 stars) for recipes
- View average rating calculation for each recipe
- Edit or delete your own reviews

### User Profiles
- Personalized user profiles with bio, profile picture, location, and social media links
- Track recipes created by each user
- View all reviews left by a specific user

### Contact System
- Contact form for users to send messages to administrators
- Admin dashboard to manage and respond to contact messages

### Admin Features
- User management: View, update, and delete user accounts
- Recipe moderation: Review and manage all recipes
- Contact management: Handle user inquiries

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
- Multer & Sharp (Image upload and processing)

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
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
PORT=3000
```

4. Start the application:
```bash
node app.js
```

The application will be available at http://localhost:3000.

## Project Structure
```
Recipe-Management-Application/
├── public/                 # Static files (CSS, images, scripts)
├── views/                  # EJS templates for server-side rendering
│   ├── partials/           # Reusable components (header, footer)
│   ├── auth/               # Authentication pages (login, register)
│   ├── profile/            # User profile pages
│   ├── recipes/            # Recipe-related pages
│   └── admin/              # Admin dashboard pages
├── models/                 # MongoDB models
│   ├── user.js             # User model with authentication methods
│   ├── recipe.js           # Recipe model with reviews
│   └── contact.js          # Contact form model
├── routes/                 # Route handlers
│   ├── auth.routes.js      # Authentication routes
│   ├── contact.routes.js   # Contact form routes
│   ├── user/               # User-specific routes
│   └── admin/              # Admin-specific routes
├── controllers/            # Business logic
│   ├── user/               # User controllers
│   └── admin/              # Admin controllers
├── middleware/             # Custom middleware
│   ├── isAuthenticated.js  # Authentication middleware
│   ├── isAdmin.js          # Admin role verification
│   ├── isRecipeOwner.js    # Recipe ownership verification
│   └── uploadMiddleware.js # Image upload handling
├── app.js                  # Application entry point
├── package.json            # Project configuration
└── .env                    # Environment variables
```

## API Routes

### Authentication
- `GET/POST /auth/login` - Login page and authentication
- `GET/POST /auth/register` - Registration page and user creation
- `GET /auth/logout` - Log out a user

### Recipes
- `GET /recipes` - View all recipes
- `GET /recipes/create` - Recipe creation form
- `POST /recipes` - Create a new recipe (guests allowed)
- `GET /recipes/:id` - View a specific recipe
- `GET /recipes/:id/edit` - Edit recipe form (authenticated owner only)
- `PUT /recipes/:id` - Update a recipe (authenticated owner only)
- `DELETE /recipes/:id` - Delete a recipe (authenticated owner only)
- `GET /recipes/image/:id` - Retrieve recipe image

### Reviews
- `POST /recipes/:id/reviews` - Add a review to a recipe (guests allowed)
- `PUT /recipes/:recipeId/reviews/:reviewId` - Update a review (authenticated owner only)
- `DELETE /recipes/:recipeId/reviews/:reviewId` - Delete a review (authenticated owner only)

### User Profiles
- `GET /profile/:id` - View a user's profile
- `GET /profile/:id/edit` - Edit profile form (authenticated owner only)
- `PUT /profile/:id` - Update a user's profile (authenticated owner only)
- `GET /profile/image/:id` - Retrieve profile image
- `GET /profile/:id/reviewsRecipes` - Get user's reviews and recipes

### Admin Routes
- `GET /admin` - Admin dashboard
- `GET /admin/recipes` - Manage all recipes
- `GET /admin/recipes/:recipeId` - View recipe details
- `DELETE /admin/recipes/:recipeId` - Delete any recipe
- `GET /admin/users` - Manage all users
- `GET /admin/users/:userId` - View user details
- `PUT /admin/users/:userId` - Update any user
- `DELETE /admin/users/:userId` - Delete any user
- `GET /admin/contact` - View contact messages
- `DELETE /admin/contact/:id` - Delete contact message
