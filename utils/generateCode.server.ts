import crypto from 'crypto';

export const generateCode = (length = 6) => {
    return crypto.randomBytes(length / 2).toString('hex').toUpperCase();
};