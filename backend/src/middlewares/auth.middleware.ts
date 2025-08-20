import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "PROXIMAMENTE_CLAVE_SECRETA";

declare global{
    namespace Express {
        interface Request {
            user?: {
                id: string;
                iat: number;
                exp: number;
            };
        }
    }
}

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(401).json({ message: "Token no proporcionado" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, SECRET_KEY) as any;
        req.user = decoded;

        next();
    } catch(err){
        console.error("Error de Verificacion de Token;", err);
        res.status(401).json({ message: "Token Inválido o Expirado" });
    }
};