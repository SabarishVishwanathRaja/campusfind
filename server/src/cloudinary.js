const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a memory buffer to Cloudinary
 * If Cloudinary credentials are not configured in local .env, falls back to a base64 data URL
 * @param {Buffer} buffer - File buffer from multer memory storage
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadBuffer = (buffer) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return Promise.resolve({
      url: `data:image/jpeg;base64,${buffer.toString('base64')}`,
      publicId: `local_upload_${Date.now()}`
    });
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'campusfind',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an asset from Cloudinary by public ID
 * @param {string} publicId - Cloudinary asset public ID
 * @returns {Promise<any>}
 */
const deleteImage = async (publicId) => {
  if (!publicId || publicId.startsWith('local_upload_')) return null;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return null;
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', publicId, error.message);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadBuffer,
  deleteImage
};
