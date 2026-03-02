/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { diskStorage } from 'multer';

export const storage = (path = '/upload/general') => {
  return diskStorage({
    filename(req, file, callback) {
      const uniqueName = Date.now() + '-' + file.originalname;
      callback(null, uniqueName);
    },
    destination: path,
  });
};
