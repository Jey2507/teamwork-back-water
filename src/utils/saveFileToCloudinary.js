import cloudinary from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';

cloudinary.config({
  secure: true,
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

export const saveFileToCloudinary = async (file) => {
  try {
    console.log('Uploading file to Cloudinary:', file);
    const response = await cloudinary.v2.uploader.upload(file.path);
    console.log('Upload response:', response);
    return response.secure_url;
  } catch (error) {
    console.error('Failed to upload file to Cloudinary:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};
