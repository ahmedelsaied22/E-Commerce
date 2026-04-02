/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import multer, { diskStorage } from 'multer';

export const fileTypes = {
  image: ['image/jpeg', 'image/png', 'image/jpg'],
  video: ['video/mp4'],
};

export const uploadFileToCloudinary = (type = fileTypes.image) => {
  const storage = diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (!type.includes(file.mimetype)) {
      return cb(new Error('in-valid file type'), false);
    } else {
      return cb(null, true);
    }
  };
  return multer({ storage, fileFilter });
};
