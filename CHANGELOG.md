# Changelog

All notable changes to this project are documented in this file.

The format is based on a simple academic release history for the final **Placemark** submission.

## [0.15.0] - Sanitization and Share

### Added
- sanitization of category, placemark, review, and user text inputs
- shareable public placemark link on the public placemark page
- copy-link functionality for public placemark sharing
- API tests for sanitization behaviour

### Notes
- this release adds sanitization and a share feature to the PlacemarkHAPI Assignment 2 implementation

## [0.14.0] - Test Coverage Reporting

### Added
- coverage reporting for the project
- HTML and text coverage report generation

### Improved
- expanded the tests to improve code coverage across authentication, categories, reviews, ratings, and utility functions

### Notes
- this release adds coverage report support for the PlacemarkHAPI

## [0.13.0] - Ratings

### Added
- rating support for placemark reviews
- average placemark rating display on private and public placemark pages
- average rating display on public category placemark cards
- API and model tests for review ratings

### Improved
- extended the review feature to support 1 to 5 ratings
- updated review forms to capture both comment and rating
- updated placemark and public placemark views to show rating information

### Notes
- this release extends the PlacemarkHAPI Assignment 2 review feature with ratings

## [0.12.0] - Reviews

### Added

- public placemark detail pages
- review support for placemarks
- public display of placemark reviews
- review API endpoints
- API and model tests for reviews

### Notes
- this release completes the reviews part for the PlacemarkHAPI Assignment 2 path

## [0.11.0] - Public / Private POIs

### Added
- public and private placemark support using an `isPublic` field
- public categories page showing only categories with public placemarks
- public category detail page showing only public placemarks
- API and model tests for public placemark behaviour

### Improved
- fixed some of the failing tests
- stopped database reseeding on every restart unless explicitly enabled

### Security
- hashed seeded passwords to match the application password hashing approach

### Notes
- this release extends the PlacemarkHAPI Assignment 2 feature set


## [0.10.2] - Final Submission / Release 4

### Added
- admin dashboard functionality
- basic summary statistics for admin view
- image upload support using Cloudinary
- JWT authentication for API access
- API authentication and endpoint test coverage
- final MongoDB-backed project configuration for deployment

### Improved
- refined Placemark functionality for final submission
- aligned project structure with full Placemark specification
- updated README and changelog to reflect the final application instead of the earlier Playtime project

### Notes
- this release represents the final coursework submission
- version matches `package.json`

---

## [0.9.0] - Release 3

### Added
- category support for placemarks
- Swagger/OpenAPI documentation
- MongoDB / Mongoose data models
- API routes for core entities
- model and API test structure

### Improved
- upgraded the project from local / JSON persistence toward full database-backed storage
- improved validation and API organisation

---

## [0.6.0] - Release 2

### Added
- placemark CRUD functionality
- descriptions and coordinate fields
- user-owned placemark collections
- account deletion and cookie-based authentication flow

### Improved
- extended the original Playtime structure into a location-based POI application
- improved form validation and controller flow

---

## [0.1.0] - Release 1

### Added
- initial Placemark project setup from the Playtime base application
- signup, login, and logout
- base routing, controllers, and views

### Notes
- first working conversion from Playtime to Placemark

---
