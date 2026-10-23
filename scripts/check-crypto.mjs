import 'reflect-metadata';
import { CryptoService } from '../dist/shared/crypto/services/crypto.service.js'

const crypto_service = new CryptoService();

const first_hash = await crypto_service.hashPassword('admin123');
const second_hash = await crypto_service.hashPassword('admin123');

console.log('hashes diferentes:', first_hash !== second_hash);
console.log('senha certa:', await crypto_service.comparePassword('admin123', first_hash))
console.log('senha errada:', await crypto_service.comparePassword('outra', first_hash))

const encrypted = crypto_service.encryptData('12345678909')
console.log('ida e volta:', crypto_service.decryptData(encrypted))