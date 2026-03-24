import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Safety Check: Warn in the console if keys are missing
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.warn("⚠️ [WARNING]: Missing Cloudinary environment variables. Deleting products will fail.");
}

// Configure with type assertions (as string) to satisfy TypeScript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Extracts the public_id from a Cloudinary URL.
 */
export const extractPublicId = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(p => p === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get everything after the version number (e.g., v123456)
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    
    // Remove the file extension
    return fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;
  } catch (e) {
    console.error("Error extracting public ID from URL", e);
    return null;
  }
};

/**
 * Securely deletes a file from your Cloudinary vault
 */
export const deleteCloudinaryMedia = async (url: string) => {
  const publicId = extractPublicId(url);
  if (!publicId) return;

  try {
    // Cloudinary needs to know if it's destroying a video or an image
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
    const resourceType = isVideo ? 'video' : 'image';

    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log(`[Cloudinary] Successfully deleted: ${publicId}`);
  } catch (error) {
    console.error(`[Cloudinary] Failed to delete: ${publicId}`, error);
  }
};