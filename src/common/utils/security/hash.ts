import bcrypt from 'bcrypt';

export const createHash = async (data: string): Promise<string> => {
  return await bcrypt.hash(data, 10);
};

export const compareHash = async (
  data: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(data, hash);
};
