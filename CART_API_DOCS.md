# Cart API Documentation

## Overview
The Cart API provides endpoints for managing user shopping carts. All endpoints require JWT authentication.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints

### 1. Add Item to Cart
**Endpoint:** `POST /cart/add`

**Description:** Add a book to the user's cart or update quantity if book already exists.

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "book": "699f38fd8024640655398fed",
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3974e732ef7f775157e5",
    "user": "699f3965e732ef7f775157df",
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fed",
          "name": "The Shining",
          "price": 19.99,
          "stock": 10
        },
        "quantity": 2,
        "price": 19.99,
        "_id": "699f3974e732ef7f775157e6"
      }
    ],
    "totalPrice": 39.98,
    "createdAt": "2026-02-25T18:03:32.962Z",
    "updatedAt": "2026-02-25T18:03:32.962Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "book": "699f38fd8024640655398fed",
    "quantity": 2
  }'
```

---

### 2. View User's Cart
**Endpoint:** `GET /cart`

**Description:** Retrieve the user's shopping cart with populated book details and calculated total price.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3974e732ef7f775157e5",
    "user": {
      "_id": "699f3965e732ef7f775157df",
      "email": "testuser@example.com",
      "firstName": "Test",
      "lastName": "User",
      "role": "User"
    },
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fed",
          "name": "The Shining",
          "cover": "https://via.placeholder.com/150",
          "price": 19.99,
          "stock": 10
        },
        "quantity": 2,
        "price": 19.99,
        "_id": "699f3974e732ef7f775157e6"
      },
      {
        "book": {
          "_id": "699f38fd8024640655398fee",
          "name": "It Novel",
          "cover": "https://via.placeholder.com/150",
          "price": 24.99,
          "stock": 7
        },
        "quantity": 1,
        "price": 24.99,
        "_id": "699f3982e732ef7f775157f2"
      }
    ],
    "createdAt": "2026-02-25T18:03:32.962Z",
    "updatedAt": "2026-02-25T18:03:32.962Z",
    "totalPrice": 64.97
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/cart \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. Update Item Quantity
**Endpoint:** `PATCH /cart/update/{bookId}`

**Description:** Update the quantity of an existing item in the cart.

**URL Parameters:**
- `bookId` (string, required): MongoDB ObjectId of the book

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "quantity": 5
}
```

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3974e732ef7f775157e5",
    "user": "699f3965e732ef7f775157df",
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fee",
          "name": "It Novel",
          "price": 24.99
        },
        "quantity": 5,
        "price": 24.99
      }
    ],
    "totalPrice": 124.95
  }
}
```

**cURL Example:**
```bash
curl -X PATCH http://localhost:8000/cart/update/699f38fd8024640655398fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "quantity": 5
  }'
```

---

### 4. Remove Item from Cart
**Endpoint:** `DELETE /cart/remove/{bookId}`

**Description:** Remove a specific book from the user's cart.

**URL Parameters:**
- `bookId` (string, required): MongoDB ObjectId of the book to remove

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3974e732ef7f775157e5",
    "user": "699f3965e732ef7f775157df",
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fee",
          "name": "It Novel",
          "price": 24.99
        },
        "quantity": 5,
        "price": 24.99
      }
    ],
    "totalPrice": 124.95
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/cart/remove/699f38fd8024640655398fed \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. Clear Cart
**Endpoint:** `DELETE /cart/clear`

**Description:** Remove all items from the user's shopping cart.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3974e732ef7f775157e5",
    "user": "699f3965e732ef7f775157df",
    "items": [],
    "totalPrice": 0,
    "createdAt": "2026-02-25T18:03:32.962Z",
    "updatedAt": "2026-02-25T18:04:09.038Z"
  }
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:8000/cart/clear \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Error Responses

### 401 Unauthorized
**Response:**
```json
{
  "status": "unsuccessful",
  "message": "You are not logged in! Please log in to get access."
}
```

### 400 Bad Request (Validation Error)
**Response:**
```json
{
  "status": "unsuccessful",
  "message": "Validation error: Invalid Book ID format., Quantity must be at least 1."
}
```

### 404 Not Found
**Response:**
```json
{
  "status": "unsuccessful",
  "message": "Book not found. Invalid book ID."
}
```

---

## Test Workflow Example

### 1. Create User (Signup)
```bash
curl -X POST http://localhost:8000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123!",
    "passwordConfirm": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login to Get Token
```bash
curl -X POST http://localhost:8000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Password123!"
  }'
```

This returns a token like:
```json
{
  "status": "successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Get Books to Find Book IDs
```bash
curl -X GET http://localhost:8000/book
```

### 4. Add Items to Cart
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Add first book
curl -X POST http://localhost:8000/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"book": "699f38fd8024640655398fed", "quantity": 2}'

# Add second book
curl -X POST http://localhost:8000/cart/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"book": "699f38fd8024640655398fee", "quantity": 1}'
```

### 5. View Cart
```bash
curl -X GET http://localhost:8000/cart \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Update Quantity
```bash
curl -X PATCH http://localhost:8000/cart/update/699f38fd8024640655398fee \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 5}'
```

### 7. Remove Item
```bash
curl -X DELETE http://localhost:8000/cart/remove/699f38fd8024640655398fed \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Clear Cart
```bash
curl -X DELETE http://localhost:8000/cart/clear \
  -H "Authorization: Bearer $TOKEN"
```

---

## Features

✅ **User Authentication**: All routes protected with JWT
✅ **Input Validation**: Joi schemas validate all inputs
✅ **Error Handling**: Comprehensive error messages
✅ **Total Price**: Automatically calculated for all cart operations
✅ **Book Population**: Returns full book details with cart items
✅ **User-Specific**: Each user has their own cart
✅ **Swagger Documentation**: Integrated with API docs

---

## Files Created/Modified

### Created Files:
- `/controllers/cartController.js` - Cart business logic
- `/routes/cartRoutes.js` - Cart API endpoints

### Modified Files:
- `/controllers/index.js` - Export cartController
- `/routes/index.js` - Register cart routes
- `/validations/auth.validation.js` - Added signupSchema export

---

## Technical Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI
