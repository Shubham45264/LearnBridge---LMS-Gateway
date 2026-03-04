import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({});

// check and load env variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });

    return uploadResponse;
  } catch (error) {
    console.log("Error in uploading media to cloudinary");
    console.log(error);

  }
}

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error in deleting media from cloudinary");
    console.log(error);
  }
}

export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
  } catch (error) {
    console.log("Error in deleting media from cloudinary");
    console.log(error);
  }
}
export default cloudinary;
