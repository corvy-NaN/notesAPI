import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import { getOne, executeInsert } from "../lib/databaseClient";
import bcrypt from "bcrypt";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: "Username y Password Requeridos" });
            return;
        }

        const query = `
            SELECT Id, Username, PasswordHash, Email, CreatedAt
            FROM Users
            WHERE Username = @username
        `;

        const userData = await getOne(query, { username });

        if (!userData) {
            res.status(401).json({ message: "Usuario No Encontrado" });
            return;
        }

        const validPass = await bcrypt.compare(password, userData.PasswordHash);
        if (!validPass) {
            res.status(401).json({ message: "Password Invalido" });
            return;
        }

        const token = generateToken(userData.Id);

        res.status(200).json({
            message: "Login Exitoso",
            token: token,
            user: {
                id: userData.Id,
                username: userData.Username
            }
        });

    } catch (err) {
        console.error('Error Completo:', err);
        res.status(500).json({
            message: "Error Interno del Servidor",
            error: err
        });
    }
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, email } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: "Username y password son requeridos" });
            return;
        }

        const existingUser = await getOne(
            "SELECT Id FROM Users WHERE Username = @username",
            { username }
        );

        if (existingUser) {
            res.status(409).json({ message: "El usuario Ya Existe" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO Users (Username, PasswordHash, Email, CreatedAt)
            OUTPUT INSERTED.Id, INSERTED.Username, INSERTED.Email
            VALUES (@username, @passwordHash, @email, GETDATE())
        `;

        const newUser = await executeInsert(query, {
            username,
            passwordHash: hashedPassword,
            email: email || null
        });

        if (!newUser) {
            res.status(500).json({ message: "Error al Crear Usuario" });
            return;
        }

        const token = generateToken(newUser.Id);

        res.status(201).json({
            message: "Usuario Registrado Exitosamente",
            token,
            user: {
                id: newUser.Id,
                username: newUser.Username
            }
        });

    } catch (err) {
        console.error("Error Inesperado en registerUser:", err);
        res.status(500).json({ message: "Error Interno del Servidor" });
    }
};