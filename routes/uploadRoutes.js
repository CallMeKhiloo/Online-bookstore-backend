const express = require('express');
const asyncWrapper = require('../helpers/asyncWrapper');
const {uploadController} = require('../controllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Cloudinary pre-signed upload signature
 */

/**
 * @swagger
 * /upload/signature:
 *   get:
 *     summary: Get a Cloudinary pre-signed upload signature
 *     tags: [Upload]
 *     description: >
 *       Returns a signature and timestamp that the frontend uses to upload
 *       images directly to Cloudinary. After the upload, use the returned
 *       Cloudinary URL as the `cover` field when creating a book.
 *     responses:
 *       200:
 *         description: Signature generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 signature:
 *                   type: string
 *                   example: 'a1b2c3d4e5f6...'
 *                 timestamp:
 *                   type: integer
 *                   example: 1700000000
 *                 cloudName:
 *                   type: string
 *                   example: 'your-cloud-name'
 *                 apiKey:
 *                   type: string
 *                   example: '123456789012345'
 *                 folder:
 *                   type: string
 *                   example: 'book-covers'
 *       500:
 *         description: Server error
 */
router.get('/signature', async (req, res, next) => {
  try {
    const data = uploadController.uploadController();
    res.status(200).json({
      signature: data.signature,
      timestamp: data.timestamp,
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
