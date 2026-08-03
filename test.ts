import crypto, { randomBytes } from 'node:crypto';

const random = randomBytes(8).toString('hex');

console.log(`pay_${random}`);