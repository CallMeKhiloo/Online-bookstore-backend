const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const cors = require('cors');
const { requestLogger } = require('./middlewares/logger');

const router = require('./routes');

dotenv.config({ path: path.join(__dirname, '.env') });
require('./config/cloudinary');

const database = process.env.DATABASE_URI;
mongoose
  .connect(database)
  .then(() => {
    console.log('CONNECTED TO THE DATABASE ✅💪');
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

const app = express();

app.use(
  cors({
    origin: 'http://localhost:4200',
  }),
);

//global middlewares
app.use(express.static(path.join(__dirname, 'public'))); // to serve static files
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(requestLogger); // to log HTTP requests using morgan and winston

app.use(router);

app.use((req, res) => {
  res.status(404).json({
    status: 'unsuccessful',
    message: 'Page not found',
  });
});

//global error middleware
app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).json({ status: 'unsuccessful', message: error.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port ${port} 🚀✨`);
});
