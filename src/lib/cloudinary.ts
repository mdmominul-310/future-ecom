/**
 * Local Cloudinary Compatibility Layer
 * Intercepts all Cloudinary calls and stores files in the local filesystem under public/uploads/
 */
import { saveBase64Image, deleteLocalImage } from "./storage";

const localCloudinary = {
  config: (_opts?: any) => {},
  uploader: {
    upload: async (fileData: string, options: any = {}) => {
      const folder = options.folder
        ? options.folder.replace(/\//g, "-").replace(/[^a-zA-Z0-9_-]/g, "_")
        : "uploads";

      const result = await saveBase64Image(fileData, folder);
      if (result) {
        return {
          public_id: result.public_id,
          secure_url: result.url,
          url: result.url,
        };
      }

      // If already a valid URL or path
      return {
        public_id: "local_asset",
        secure_url: fileData,
        url: fileData,
      };
    },
    destroy: async (publicId: string) => {
      if (publicId) {
        await deleteLocalImage(publicId);
      }
      return { result: "ok" };
    },
  },
  api: {
    delete_resources: async (publicIds: string[]) => {
      if (Array.isArray(publicIds)) {
        for (const id of publicIds) {
          await deleteLocalImage(id);
        }
      }
      return { deleted: publicIds };
    },
  },
};

export default localCloudinary;
