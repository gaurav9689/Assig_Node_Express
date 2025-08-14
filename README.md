# User RESTful API (Assignment-Ready)

This project implements a simple RESTful API using **Node.js** and **Express** for managing users.

## Features Covered (per assignment)
  - `GET /users` – List users
  - `GET /users/:id` – Get user by ID
  - `POST /user` – Add user
  - `PUT /user/:id` – Update user
  - `DELETE /user/:id` – Delete user
- **Middleware**:
  - Logger (method, URL, status code, response time)
  - Validation (required fields)
- **Error Handling**:
  - Proper status codes (200, 201, 204, 400, 404, 500)
  - Meaningful error messages
- **Data Source**: Array of user objects

## Sample User Object
```json
{
  "id": "1",
  "firstName": "Gaurav",
  "lastName": "Chikate",
  "hobby": "Software Developer"
}
```

## Quick Start
```bash
npm install
npm start
```

Server will start at `http://localhost:3000`.

## Testing (Postman)
Import the provided Postman collection: `UserAPI.postman_collection.json`

### Notes
- Data is **in-memory** only; server restart resets data.
- `POST /user` requires: `id`, `firstName`, `lastName`, `hobby` (and `id` must be unique).
- `PUT /user/:id` requires: `firstName`, `lastName`, `hobby`.

- # github link : https://github.com/gaurav9689/Assig_Node_Express.git
