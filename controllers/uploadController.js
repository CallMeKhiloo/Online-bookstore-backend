const cloudinary = require('cloudinary').v2;

exports.uploadController = () => {
  const timestamp = Math.round((new Date).getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({
    timestamp: timestamp,
    folder: 'book-covers'
  }, process.env.CLOUDINARY_API_SECRET);
  return {signature ,timestamp};
}