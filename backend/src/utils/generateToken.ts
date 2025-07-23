import jwt from "jsonwebtoken";

const SECRET_KEY = "PROXIMAMENTE_CLAVE_SECRETA";

export const generateToken = (userId: number): string => {
    return jwt.sign({id: userId }, SECRET_KEY, { expiresIn: "1h" });
};