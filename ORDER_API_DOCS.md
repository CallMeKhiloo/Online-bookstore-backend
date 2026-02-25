# Order API Documentation

## Overview
The Order API provides endpoints for managing user orders and order history. Users can create orders and view their order history. Administrators have additional endpoints to view all orders, filter orders, view specific user orders, and update order and payment statuses.

All endpoints require JWT authentication.

## Base URL
```
http://localhost:8000
```

## Authentication
All endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Authorization Levels
- **User**: Can create orders, view their own orders
- **Admin**: Can create orders, view all orders, update order statuses, view specific user orders

---

## User Endpoints

### 1. Create Order
**Endpoint:** `POST /order`

**Description:** Create a new order from cart items or provided items. Automatically calculates the total amount from book prices.

**Authorization:** User (any authenticated user)

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "shippingDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "Credit Card",
  "items": [
    {
      "book": "699f38fd8024640655398fed",
      "quantity": 2
    },
    {
      "book": "699f38fd8024640655398fee",
      "quantity": 1
    }
  ]
}
```

**Validation Rules:**
- At least one item must be provided
- Book IDs must be valid ObjectIds
- Quantities must be positive integers
- Shipping details are required and must be complete
- Payment method is required

**Response (201 Created):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3f246f16d03e88688a7e",
    "user": "699f3ecc6f16d03e88688a75",
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fed",
          "title": "The Shining",
          "price": 19.99
        },
        "quantity": 2,
        "_id": "699f3f246f16d03e88688a7f"
      },
      {
        "book": {
          "_id": "699f38fd8024640655398fee",
          "title": "It Novel",
          "price": 24.99
        },
        "quantity": 1,
        "_id": "699f3f246f16d03e88688a80"
      }
    ],
    "shippingDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Credit Card",
    "orderStatus": "Pending",
    "paymentStatus": "Pending",
    "totalAmount": 64.97,
    "createdAt": "2026-02-25T20:24:00.000Z",
    "updatedAt": "2026-02-25T20:24:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:8000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "shippingDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Credit Card",
    "items": [
      {
        "book": "699f38fd8024640655398fed",
        "quantity": 2
      },
      {
        "book": "699f38fd8024640655398fee",
        "quantity": 1
      }
    ]
  }'
```

---

### 2. View My Orders
**Endpoint:** `GET /order/my-orders`

**Description:** Retrieve the authenticated user's order history with pagination support.

**Authorization:** User (any authenticated user)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Orders per page (default: 10)

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": [
    {
      "_id": "699f3f246f16d03e88688a7e",
      "user": "699f3ecc6f16d03e88688a75",
      "items": [
        {
          "book": {
            "_id": "699f38fd8024640655398fed",
            "title": "The Shining",
            "price": 19.99
          },
          "quantity": 2
        },
        {
          "book": {
            "_id": "699f38fd8024640655398fee",
            "title": "It Novel",
            "price": 24.99
          },
          "quantity": 1
        }
      ],
      "shippingDetails": {
        "firstName": "John",
        "lastName": "Doe",
        "address": "123 Main Street",
        "city": "New York",
        "state": "NY"
      },
      "orderStatus": "Pending",
      "paymentStatus": "Pending",
      "totalAmount": 64.97,
      "createdAt": "2026-02-25T20:24:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/order/my-orders?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 3. View Specific Order
**Endpoint:** `GET /order/my-orders/{orderId}`

**Description:** Retrieve detailed information about a specific order belonging to the authenticated user.

**Authorization:** User (must be owner of the order)

**URL Parameters:**
- `orderId` (string, required): MongoDB ObjectId of the order

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3f246f16d03e88688a7e",
    "user": {
      "_id": "699f3ecc6f16d03e88688a75",
      "email": "customer@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "items": [
      {
        "book": {
          "_id": "699f38fd8024640655398fed",
          "title": "The Shining",
          "author": "Stephen King",
          "price": 19.99,
          "cover": "https://via.placeholder.com/150"
        },
        "quantity": 2,
        "_id": "699f3f246f16d03e88688a7f"
      },
      {
        "book": {
          "_id": "699f38fd8024640655398fee",
          "title": "It Novel",
          "author": "Stephen King",
          "price": 24.99,
          "cover": "https://via.placeholder.com/150"
        },
        "quantity": 1,
        "_id": "699f3f246f16d03e88688a80"
      }
    ],
    "shippingDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Credit Card",
    "orderStatus": "Processing",
    "paymentStatus": "Completed",
    "totalAmount": 64.97,
    "createdAt": "2026-02-25T20:24:00.000Z",
    "updatedAt": "2026-02-25T20:30:15.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:8000/order/my-orders/699f3f246f16d03e88688a7e \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Admin Endpoints

### 4. View All Orders
**Endpoint:** `GET /order/admin/all`

**Description:** Retrieve all orders with support for pagination and filtering by status. Admin only.

**Authorization:** Admin

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Orders per page (default: 10)
- `status` (string, optional): Filter by order status
  - Valid values: `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled`
- `paymentStatus` (string, optional): Filter by payment status
  - Valid values: `Pending`, `Completed`, `Failed`, `Refunded`

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": [
    {
      "_id": "699f3f246f16d03e88688a7e",
      "user": {
        "_id": "699f3ecc6f16d03e88688a75",
        "email": "customer@example.com",
        "firstName": "John",
        "lastName": "Doe"
      },
      "items": [
        {
          "book": {
            "_id": "699f38fd8024640655398fed",
            "title": "The Shining",
            "price": 19.99
          },
          "quantity": 2
        }
      ],
      "orderStatus": "Processing",
      "paymentStatus": "Completed",
      "totalAmount": 64.97,
      "createdAt": "2026-02-25T20:24:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

**cURL Examples:**
```bash
# Get all orders (first page)
curl -X GET "http://localhost:8000/order/admin/all" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Get orders with pagination
curl -X GET "http://localhost:8000/order/admin/all?page=2&limit=5" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Filter by order status
curl -X GET "http://localhost:8000/order/admin/all?status=Processing" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Filter by payment status
curl -X GET "http://localhost:8000/order/admin/all?paymentStatus=Completed" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Combined filters
curl -X GET "http://localhost:8000/order/admin/all?status=Shipped&paymentStatus=Completed&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 5. View User's Orders (Admin)
**Endpoint:** `GET /order/admin/user/{userId}`

**Description:** Retrieve all orders for a specific user. Admin only.

**Authorization:** Admin

**URL Parameters:**
- `userId` (string, required): MongoDB ObjectId of the user

**Request Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Orders per page (default: 10)

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": [
    {
      "_id": "699f3f246f16d03e88688a7e",
      "user": "699f3ecc6f16d03e88688a75",
      "items": [
        {
          "book": {
            "_id": "699f38fd8024640655398fed",
            "title": "The Shining",
            "price": 19.99
          },
          "quantity": 2
        },
        {
          "book": {
            "_id": "699f38fd8024640655398fee",
            "title": "It Novel",
            "price": 24.99
          },
          "quantity": 1
        }
      ],
      "orderStatus": "Processing",
      "paymentStatus": "Completed",
      "totalAmount": 64.97,
      "createdAt": "2026-02-25T20:24:00.000Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:8000/order/admin/user/699f3ecc6f16d03e88688a75?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### 6. Update Order Status
**Endpoint:** `PATCH /order/admin/update/{orderId}`

**Description:** Update the order status and/or payment status of an existing order. Admin only.

**Authorization:** Admin

**URL Parameters:**
- `orderId` (string, required): MongoDB ObjectId of the order

**Request Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "orderStatus": "Shipped",
  "paymentStatus": "Completed"
}
```

**Valid Order Statuses:**
- `Pending` - Initial status when order is created
- `Processing` - Order is being prepared
- `Shipped` - Order has been dispatched
- `Delivered` - Order has been delivered
- `Cancelled` - Order has been cancelled

**Valid Payment Statuses:**
- `Pending` - Payment not yet processed
- `Completed` - Payment successfully processed
- `Failed` - Payment failed
- `Refunded` - Payment has been refunded

**Validation Rules:**
- At least one field (orderStatus or paymentStatus) must be provided
- Status values must be from the valid lists above
- Cannot update an already delivered order

**Response (200 OK):**
```json
{
  "status": "successful",
  "data": {
    "_id": "699f3f246f16d03e88688a7e",
    "orderStatus": "Shipped",
    "paymentStatus": "Completed",
    "totalAmount": 64.97,
    "updatedAt": "2026-02-25T20:35:00.000Z"
  }
}
```

**cURL Examples:**
```bash
# Update order status only
curl -X PATCH http://localhost:8000/order/admin/update/699f3f246f16d03e88688a7e \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "orderStatus": "Shipped"
  }'

# Update payment status only
curl -X PATCH http://localhost:8000/order/admin/update/699f3f246f16d03e88688a7e \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "paymentStatus": "Completed"
  }'

# Update both statuses
curl -X PATCH http://localhost:8000/order/admin/update/699f3f246f16d03e88688a7e \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "orderStatus": "Delivered",
    "paymentStatus": "Completed"
  }'
```

---

## Error Responses

### 401 Unauthorized
**Triggered when:** Missing or invalid JWT token

**Response:**
```json
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}
```

### 403 Forbidden
**Triggered when:** User attempts to access admin endpoints or view another user's order

**Response:**
```json
{
  "status": "error",
  "message": "You do not have permission to perform this action"
}
```

### 404 Not Found
**Triggered when:** Order does not exist or user does not have access

**Response:**
```json
{
  "status": "error",
  "message": "Order not found"
}
```

### 400 Bad Request
**Triggered when:** Validation errors occur (invalid data format, missing required fields)

**Response:**
```json
{
  "status": "error",
  "message": "Validation error: Items array is required., At least one item must be provided in the order."
}
```

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - User lacks permission |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

---

## Data Models

### Order Document
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [
    {
      book: ObjectId (populated with book details),
      quantity: Number,
      _id: ObjectId
    }
  ],
  shippingDetails: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  orderStatus: String (enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']),
  paymentStatus: String (enum: ['Pending', 'Completed', 'Failed', 'Refunded']),
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Usage Examples

### Complete Order Workflow

**Step 1: Create an Order**
```bash
curl -X POST http://localhost:8000/order \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "shippingDetails": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1-555-1234",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "Credit Card",
    "items": [
      {"book": "BOOK_ID_1", "quantity": 2},
      {"book": "BOOK_ID_2", "quantity": 1}
    ]
  }'
```

**Step 2: View Order (User)**
```bash
curl -X GET http://localhost:8000/order/my-orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Step 3: Admin Views All Orders**
```bash
curl -X GET "http://localhost:8000/order/admin/all?status=Pending" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Step 4: Admin Updates Status**
```bash
curl -X PATCH http://localhost:8000/order/admin/update/ORDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "orderStatus": "Processing",
    "paymentStatus": "Completed"
  }'
```

**Step 5: User Verifies Update**
```bash
curl -X GET http://localhost:8000/order/my-orders/ORDER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing Checklist

- [ ] User creates order with valid shipping details
- [ ] User views their own orders
- [ ] User cannot view other user's orders
- [ ] User can view details of their specific order
- [ ] Admin can view all orders
- [ ] Admin can filter orders by status
- [ ] Admin can filter orders by payment status
- [ ] Admin can view specific user's orders
- [ ] Admin can update order status
- [ ] Admin can update payment status
- [ ] Non-admin users cannot access admin endpoints
- [ ] Unauthenticated requests return 401
- [ ] Invalid order IDs return 404
- [ ] Validation errors return 400 with clear messages
- [ ] Total amount is correctly calculated from items

---

## Notes

- All timestamps are in UTC format (ISO 8601)
- Orders are immutable once created (except for status updates by admin)
- Book prices are stored at order creation time for historical accuracy
- Pagination starts at page 1
- Default limit is 10 items per page
- Status filters are case-sensitive
