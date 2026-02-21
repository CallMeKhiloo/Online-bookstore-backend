const cloudinary = require('cloudinary').v2;

exports.uploadController = () => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'book-covers'
  }, process.env.CLOUDINARY_API_SECRET);
  return signature;
}