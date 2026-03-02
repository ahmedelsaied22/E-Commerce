import * as fs from 'fs';
import * as path from 'path';

export const deleteImage = async (filePath: string) => {
  try {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (err) {
    console.log('Error deleting file => ' + err);
  }
};
