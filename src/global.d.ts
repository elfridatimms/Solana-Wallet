declare module 'crypto-browserify' {
    import { Hash, Hmac } from 'crypto';

    export function createHash(algorithm: string): Hash;
    export function createHmac(algorithm: string, key: string | Buffer | DataView): Hmac;
    export const randomBytes: (size: number) => Buffer;
    export const pbkdf2Sync: (
        password: string | Buffer,
        salt: string | Buffer,
        iterations: number,
        keylen: number,
        digest: string
    ) => Buffer;
    // Add other exports if needed
}
