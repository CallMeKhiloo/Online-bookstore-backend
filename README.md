# 📚 Online Bookstore API (Node.js + MongoDB)

The robust backend engine for the 6-day full-stack bookstore project, featuring secure authentication, role-based access control (RBAC), and ACID-compliant order transactions.

## 🚀 Quick Start
1.  **Clone & Install:**
    ```bash
    cd backend
    npm install
    ```
2.  **Environment Setup:** Create a `.env` file in the root using `.env.example` as a template.
3.  **Run Development:**
    ```bash
    npm run dev
    ```

## 🛠️ Tech Stack
* **Runtime:** Node.js with Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Security:** JWT, Bcrypt, and Joi/Ajv Validation
* **Storage:** Cloudinary for Book Cover Uploads
* **Logging:** Winston / Pino for request and error tracking

## 🔌 Core API Endpoints
| Route | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | POST | Public | Create new account |
| `/auth/login` | POST | Public | Get JWT token |
| `/books` | GET | Public | List books with pagination/filtering |
| `/books` | POST | Admin | Add new book with cover upload |
| `/cart` | POST/GET | User | Manage shopping cart items |
| `/orders` | POST | User | Place order using MongoDB Transactions |
| `/reviews` | POST | User | Add review (verified purchasers only) |

## 👥 Team Responsibilities
* **Khalil:** Auth logic, JWT middleware, and User profile routes.
* **Hamdy:** Book, Category, and Author schemas and CRUD.
* **Ahmed Wael:** Cart/Order routes and transaction management.
* **Hashim:** Review routes, centralized error handling, and logging.

---
*Created during a 6-day intensive sprint.*
