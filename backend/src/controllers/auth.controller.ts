import { Request, Response } from "express";
import { supabase } from "../lib/supabaseClient";
import { generateToken } from "../utils/generateToken";
import bcrypt from "bcrypt";


export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        console.log("Datos Recibidos", { username, password });

        if (!username || !password) {
            res.status(400).json({ message: "Username y password son requeridos" });
            return;
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        console.log("Resultado de Busqueda:",{ userData, userError});

        if (userError) {
            console.error('Error busqueda', userError);
            res.status(401).json({ message: "Error al buscar usuario", debug: userError.message });
            return;
        }

        if (!userData) {
            res.status(401).json({ message: "Usuario no Encontrado" });
            return;
        }

        const validPass =await bcrypt.compare(password, userData.password);
        if (!validPass) {
            console.log("Password incorrecto");
            res.status(401).json({ message: "Password Invalido" });
            return;
        }

        const token = generateToken(userData.id);

        res.status(200).json({
            message: "Login Exitoso",
            token: token,
            user: {
                id: userData.id,
                username: userData.username
            }
        });

    } catch (err) {
        console.error('Error completo:', err);
        res.status(500).json({
            message: "Error interno del servidor",
            error: err
        });
    }
};


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ message: "Username y password son requeridos" });
            return;
        }

        const {data: existingUser, error: searchError } = await supabase
            .from("users")
            .select("*")
            .eq("username", username)
            .maybeSingle()
        
        if (searchError){
            console.error("Error buscando usuario Existente", searchError);
            res.status(500).json({ message: "Error al verificar Usuario", error: searchError.message});
            return;
        }
        
        if (existingUser) {
            res.status(409).json({ message: "El usuario Ya Existe"});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data, error } = await supabase
        .from("users")
        .insert([{ username, password: hashedPassword }])
        .select()
        .single();

        if (error){
            console.error("Error al Registrar", error);
            res.status(500).json({ message: "Error al crear usuario", error: error.message});
            return;
        }

        const token = generateToken(data.id);

        res.status(201).json({
            message: "Usuario Registrado Exitosamente",
            token,
            user: {
                id: data.id,
                username: data.username
            }
        });

    } catch (err) {
        console.error("Error inesperado en registerUser:", err);
        res.status(500).json({ message: "Error interno del Servidor"});
    }
};