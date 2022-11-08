import { randomUUID } from 'crypto';

const generateId = (): string => {
  return randomUUID().toString();
};

export default generateId;
