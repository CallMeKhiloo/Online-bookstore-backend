const express = require('express');
const asyncWrapper = require('../helpers/asyncWrapper');
const {uploadController} = require('../controllers');

const router = express.Router();

router.get('/signature', async (req, res, next) => {
  const [error, data] = asyncWrapper(uploadController());

  if (error) return next(error);
  res.status(200).json({
    signature: data,
    cloudName : process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    folder: 'book-covers'
  });
});

module.exports = router;
