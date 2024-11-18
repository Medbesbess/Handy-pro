const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "djgq4duh7",
  api_key: process.env.CLOUDINARY_API_KEY || "314656515618525",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "PrkPTbMmI05LsGtQWVHuLsnBdjg",
});

module.exports = cloudinary;
