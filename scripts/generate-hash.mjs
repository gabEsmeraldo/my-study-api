import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2] ?? 'admin123';
const salt = randomBytes(16);

console.log(`${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`);