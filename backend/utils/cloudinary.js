import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load .env BEFORE configuring Cloudinary
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export default cloudinary;
