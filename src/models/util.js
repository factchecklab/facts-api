import { v4 as uuidv4 } from 'uuid';

export const generateId = () => {
  const buf = Buffer.alloc(16);
  const uuid = uuidv4(null, buf);
  return buf.toString('base64').replace(/[=\+\/]/g, '');
};
