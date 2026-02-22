const express = require('express');
const asyncWrapper = require('../helpers/asyncWrapper');
const {uploadController} = require('../controllers');

const router = express.Router();

router.get('/signature', async (req, res, next) => {
  try {
    const data = uploadController();
    res.status(200).json({
      signature: data.signature,
      timestamps: data.timestamps,
      cloudName : process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: 'book-covers'
    });
  } catch (error)
  {
    next(error);
  }
});

module.exports = router;
