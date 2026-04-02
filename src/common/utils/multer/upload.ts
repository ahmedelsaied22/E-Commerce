// /* eslint-disable @typescript-eslint/await-thenable */
// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */

// // import { diskStorage } from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// // import { CloudinaryStorage } from 'cloudinary';
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// export const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return await {
//       folder: 'ecommerce',
//       format: file.mimetype.split('/')[1],
//       publid_id: Date.now() + '-' + file.originalname,
//     };
//   },
// });

// export const storage = (path = '/upload/general') => {
//   return diskStorage({
//     filename(req, file, callback) {
//       const uniqueName = Date.now() + '-' + file.originalname;
//       callback(null, uniqueName);
//     },
//     destination: path,
//   });
// };

// copy form saraha app

// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   secure: true,
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// export const uploadSingleFile = async ({ path }: { path: string }) => {
//   const { secure_url, public_id } = await cloudinary.uploader.upload(path);
//   return { secure_url, public_id };
// };

// export const destroySingleFile = async ({
//   public_id,
// }: {
//   public_id: string;
// }) => {
//   await cloudinary.uploader.destroy(public_id);
// };

// export const uploadMultiFile = async ({ paths = [] }) => {
//   if (paths.length == 0) {
//     throw new Error('no files to upload');
//   }
//   const images: any = [];
//   for (const path of paths) {
//     const { secure_url, public_id } = await uploadSingleFile({ path });
//     images.push({ secure_url, public_id });
//   }
//   return images;
// };

import { v2 } from 'cloudinary';

export const upload = async (image: string) => {
  await v2.uploader.upload(image);
};
