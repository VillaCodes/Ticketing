import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

//turns callback into promise based implementation
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    //salt is part of hashing process, generating random string
    const salt = randomBytes(8).toString('hex');
    //scrypt gives you back a buffer, an array with raw data
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');

    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}