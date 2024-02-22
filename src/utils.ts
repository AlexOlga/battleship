import crypto from 'crypto';


export const generateUniqueId = () => {
    const id = crypto.randomBytes(8).toString('hex');
    return parseInt(id, 16);
}

