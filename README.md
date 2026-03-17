# FullStackPOI / Placemark

A **Placemark / POI web application** built with **Node.js**, **Hapi.js**, **Handlebars**, **MongoDB/Mongoose**, **Joi**, **JWT authentication**, and a documented **REST API** using Swagger.

This project was developed for the **HDip in Computing, SETU Waterford, Full Stack Development 1** module and is based on the Playtime starter project, adapted into a Placemark application.

## Author

**Vlad Mihalachita**

## Repository

GitHub: `https://github.com/Vavarussle/FullStackPOI`

## Project Overview

The application allows users to:

- create an account and log in
- manage placemarks / points of interest
- group placemarks into categories
- store coordinates for locations
- upload images for placemarks
- use an admin view to manage users and see summary information
- access a REST API with Swagger documentation
- authenticate API requests using JWT

The project supports the staged architecture used in the module, including mem store, JSON store, and MongoDB models, with MongoDB configured for the final submission.

## Tech Stack

- **Node.js**
- **Hapi.js**
- **Handlebars**
- **MongoDB Atlas**
- **Mongoose**
- **Joi**
- **JWT**
- **hapi-swagger**
- **Cloudinary**
- **Mocha / Chai**
- **ESLint / Prettier**

## Application Features

### Accounts
- user signup
- login / logout
- cookie-based web authentication
- delete account
- admin account support
- JWT-based API authentication

### Placemark Features
- create, view, update, and delete placemarks
- placemark name and description
- latitude / longitude coordinates
- category assignment
- image upload support
- placemark lists associated with users

### Categories
- create and manage categories
- assign placemarks to categories
- category-based organisation of POIs

### Admin
- admin dashboard
- basic summary statistics
- user management / user deletion

### API
- REST endpoints for users, categories, and placemarks
- JWT secured routes
- Swagger documentation
- automated API tests

### Data / Models
- mem store
- JSON store
- MongoDB / Mongoose models

## Project Structure

```text
src/
  api/            API routes and controllers
  controllers/    Web controllers
  models/         Mem, JSON, and Mongo stores
  views/          Handlebars templates
test/
  api/            API tests
  models/         Model tests
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Vavarussle/FullStackPOI.git
cd FullStackPOI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Required environment variables include:

```env
cookie_name=your_cookie_name
cookie_password=your_cookie_password
db=mongo
mongoUri=your_mongodb_connection_string
cloudinary_name=your_cloudinary_cloud_name
cloudinary_key=your_cloudinary_api_key
cloudinary_secret=your_cloudinary_api_secret
```

### 4. Run the app

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

## Available Scripts

```bash
npm start
npm run dev
npm run lint
npm test
npm run testmodels
npm run testapi
```

## Testing

The project includes:
- model tests
- API tests
- authentication / JWT-related test coverage in the API test suite

Run all tests:

```bash
npm test
```

Run model tests only:

```bash
npm run testmodels
```

Run API tests only:

```bash
npm run testapi
```

## API Documentation

Swagger UI is enabled in the project for viewing and testing API endpoints in the browser when the server is running.

The API includes support for:
- user management
- authentication
- placemark CRUD
- category CRUD

## Deployment

The project is configured to use **MongoDB Atlas** and **Cloudinary**, which makes it suitable for cloud deployment.

Deployment URLs can be added here:

- Deployed App 1: `http://Vlads-MacBook-Air.local:3000`
- Deployed App 2: `https://fullstackpoi.onrender.com`

## Academic Submission Notes

This submission includes work aligned with the Placemark assignment progression:

- Level 1: accounts, basic placemark functionality
- Level 2: cookie auth, coordinates, account deletion
- Level 3: categories, MongoDB models, Swagger API
- Level 4: admin dashboard, images, JWT authentication, tests

## License

This project is submitted for academic coursework.
