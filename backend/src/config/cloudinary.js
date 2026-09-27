const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'devq3zfrq',
  api_key: process.env.CLOUDINARY_API_KEY || '469972622734135',
  api_secret: process.env.CLOUDINARY_API_SECRET || '71LmRN1RuZt9IUpxKOk27iYojdw'
});

const uploadStreamToCloudinary = (fileBuffer, folder = 'vtest_cms', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('Cloudinary delete error:', err);
  }
};

module.exports = {
  cloudinary,
  uploadStreamToCloudinary,
  deleteFromCloudinary
};
