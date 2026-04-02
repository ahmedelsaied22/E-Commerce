/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { NotFoundException } from '@nestjs/common';
import cloudinary from './cloud.config';
import { Readable } from 'stream';

export const uploadFromBuffer = async (
  file: Express.Multer.File,
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'products' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    Readable.from(file.buffer).pipe(stream);
  });
};

export const uploadSingleFile = async ({ file }: { file: string }) => {
  const { secure_url, public_id } = await cloudinary.uploader.upload(file);
  return { secure_url, public_id };
};

export const uploadMultipleFiles = async ({ files = [] }: { files: any }) => {
  if (files.length == 0) {
    throw new NotFoundException('no images to upload');
  }

  return await Promise.all(files.map((file) => uploadFromBuffer(file)));

  // return results.map((item) => ({
  //   url: item.secure_url,
  //   public_id: item.public_id,
  // }));

  //   try {
  //     // const images: { secure_url: string; public_id: string }[] = [];
  //     return new Promise((resolve, reject) => {
  // const stream = await cloudinary.uploader.upload_stream(
  //         { folder: 'products' },
  //         (err, result) => {
  //           if (err) return reject(err);
  //           return resolve(result);
  //         },
  //       );

  //       Readable.from(file.buffer).pipe(stream);
  //     }
  //     )}
  //   // } catch (err) {
  //   //   console.log(err);
  //   //   throw new BadRequestException('Upload images Error: ' + err);
  //   // }
};

export const deleteImage = async (public_id: string) => {
  await cloudinary.uploader.destroy(public_id);
};
