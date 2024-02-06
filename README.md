# Public Wall

This project is a full-stack application that displays a grid of images. Users can upload images by clicking or dragging and dropping them onto the grid. The application periodically checks the server for new images and updates the grid accordingly.

## Features

- Image grid display
- Image upload by clicking or dragging and dropping
- Periodic checks for new images
- Modal image view on click
- Server-side logic for handling image uploads and serving images
- Database operations for getting images, posting new images, and getting the count of images

## Libraries and Technologies Used

- [React](https://reactjs.org/) for the front-end
- [Node.js](https://nodejs.org/) and [Express](https://expressjs.com/) for the back-end
- [axios](https://axios-http.com/) for making HTTP requests
- [react-modal-image](https://www.npmjs.com/package/react-modal-image) for displaying images in a modal
- [pg-pool](https://www.npmjs.com/package/pg-pool) for PostgreSQL connection pooling
- [cors](https://www.npmjs.com/package/cors) for enabling Cross-Origin Resource Sharing
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management

## Database Schema

The application uses two tables in a PostgreSQL database:

- `Walls`: Each row represents a wall and has an `id`, `creation_time`, and `completion_time`.
- `Images`: Each row represents an image and has an `id`, `wall_id`, `position`, `path`, and `upload_time`. `wall_id` is a foreign key that references `id` in the `Walls` table.
