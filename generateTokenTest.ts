import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

dotenv.config();

/**
 * Generates a JWT token
 * @param payload - The payload to include in the JWT
 * @param secretKey - The secret key to sign the JWT
 * @param expiresIn - The expiration time for the JWT (optional)
 * @returns The generated JWT token
 */
const generateToken = (payload: object, secretKey: string, expiresIn: string | number = '1h'): string => {
    return jwt.sign(payload, secretKey, { expiresIn });
};


// Example usage
const secretKey = process.env.SECRET_KEY_TOKEN;

if (!secretKey) {
    throw new Error("SECRET_KEY_TOKEN is not defined in environment variables");
}

const payload = { authorized: "sample" };
export const TOKEN_SAMPLE = generateToken(payload, secretKey);

console.log(TOKEN_SAMPLE);
