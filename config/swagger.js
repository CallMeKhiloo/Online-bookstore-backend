const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Folio&Co Bookstore API',
      version: '1.0.0',
      description: 'Full API documentation for the Folio&Co Online Bookstore backend',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ─── Auth ───────────────────────────────────────────────
        RegisterBody: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', minLength: 3, maxLength: 15, example: 'John' },
            lastName:  { type: 'string', minLength: 3, maxLength: 15, example: 'Doe' },
            email:     { type: 'string', format: 'email', example: 'john@example.com' },
            password:  { type: 'string', minLength: 8, example: 'password123' },
            DOB:       { type: 'string', format: 'date', example: '1995-06-15' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        // ─── Author ─────────────────────────────────────────────
        AuthorBody: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 5, maxLength: 20, example: 'Stephen King' },
            bio:  { type: 'string', maxLength: 50, example: 'Master of the horror genre' },
          },
        },
        Author: {
          type: 'object',
          properties: {
            _id:  { type: 'string', example: '64a1b2c3d4e5f6789012345a' },
            name: { type: 'string', example: 'Stephen King' },
            bio:  { type: 'string', example: 'Master of the horror genre' },
          },
        },
        // ─── Category ───────────────────────────────────────────
        CategoryBody: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 3, maxLength: 20, example: 'horror' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            _id:  { type: 'string', example: '64a1b2c3d4e5f6789012345b' },
            name: { type: 'string', example: 'horror' },
          },
        },
        // ─── Book ───────────────────────────────────────────────
        BookBody: {
          type: 'object',
          required: ['name', 'cover', 'price', 'author', 'category'],
          properties: {
            name:     { type: 'string', minLength: 5, maxLength: 20, example: 'The Shining' },
            cover:    { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/cover.jpg' },
            price:    { type: 'number', minimum: 0.01, example: 19.99 },
            stock:    { type: 'integer', minimum: 1, default: 1, example: 10 },
            author:   { type: 'string', example: '64a1b2c3d4e5f6789012345a' },
            category: { type: 'string', example: '64a1b2c3d4e5f6789012345b' },
          },
        },
        Book: {
          type: 'object',
          properties: {
            _id:      { type: 'string', example: '64a1b2c3d4e5f6789012345c' },
            name:     { type: 'string', example: 'The Shining' },
            cover:    { type: 'string', example: 'https://res.cloudinary.com/demo/image/upload/cover.jpg' },
            price:    { type: 'number', example: 19.99 },
            stock:    { type: 'integer', example: 10 },
            author:   { $ref: '#/components/schemas/Author' },
            category: { $ref: '#/components/schemas/Category' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // ─── Cart (Ahmed's — documented for completeness) ────────
        CartItemBody: {
          type: 'object',
          required: ['bookId'],
          properties: {
            bookId:   { type: 'string', example: '64a1b2c3d4e5f6789012345c' },
            quantity: { type: 'integer', minimum: 1, default: 1, example: 2 },
          },
        },
        // ─── Order (Ahmed's) ────────────────────────────────────
        OrderBody: {
          type: 'object',
          required: ['shippingAddress'],
          properties: {
            shippingAddress: {
              type: 'object',
              properties: {
                street:  { type: 'string', example: '123 Book Lane' },
                city:    { type: 'string', example: 'Cairo' },
                country: { type: 'string', example: 'Egypt' },
              },
            },
          },
        },
        // ─── Review (Hashim's) ──────────────────────────────────
        ReviewBody: {
          type: 'object',
          required: ['bookId', 'rating'],
          properties: {
            bookId:  { type: 'string', example: '64a1b2c3d4e5f6789012345c' },
            rating:  { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            comment: { type: 'string', maxLength: 500, example: 'Amazing book, highly recommended!' },
          },
        },
        // ─── Shared ─────────────────────────────────────────────
        SuccessResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'successful' },
            len:    { type: 'integer', example: 1 },
            data:   { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            status:  { type: 'string', example: 'unsuccessful' },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;