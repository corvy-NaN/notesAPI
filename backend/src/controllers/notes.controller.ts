import { Request, Response } from "express";
import { createNoteService, deleteNoteService, getNotesService, updateNoteService} from "../services/notes.service";
import { error } from "console";


export const createNote = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const { title, content } = req.body;

        const user_id = req.user?.id;

        if (!title || !content) {
            res.status(400).json({ error: "title y content son Requeridos"});
            return;
        }
        
        if (!user_id) {
            res.status(400).json({ error: "Usuario No Autenticado"});
            return;
        }

        const { data, error } = await createNoteService(title, content, user_id);

        if (error) {
            console.error("Error en CreateNote:", error);
            res.status(500).json({error: error.message});
            return;
        }
        
        res.status(201).json({
            message: "Nota Creada Exitosamente",
            note: data?.[0] || data
        });
    } catch (err) {
        console.error("Error iniseperado en CreateNote:", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

export const getNotes = async (req: Request, res: Response): Promise<void> => {
    
    try {
        const user_id = req.user?.id;
        
        if (!user_id){
            res.status(400).json({ error: "Usuario No Autenticado"});
            return;
        }
        const { data, error } = await getNotesService(user_id);

        if (error) {
            console.error("Error en getNotes service:", error);
            res.status(500).json({error: error.message});
            return;
        }

        res.json({
            message: "Notas Obtenidas Exitosamente",
            notes: data || []
        });
    } catch (err) {
        console.error("Error inesperado en getNotes:", err);
        res.status(500).json({error: "Error interno del servidor"});
    }
};

export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.user?.id;
        const {id} = req.params;

        if (!user_id) {
            res.status(400).json({ error: "Usuario No Autenticado" });
            return;
        }

        const {error} = await deleteNoteService(id, user_id);

        if (error) {
            console.error("Error Eliminando Nota", error);
            res.status(500).json({ error: error.message });
            return;
        }

        res.status(200).json({ message: "Nota Eliminado Exitosamente"});
    } catch (err) {
        console.error("error Insesperado en DeleteNote:", err);
        res.status(500).json({ error: "Error Interno del Servidor"});
    }
};

export const updateNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const user_id = req.user?.id;
        const {id} = req.params;
        const { title, content} = req.body;

        if (!user_id) {
            res.status(400).json({ error: "Usuario No Autenticado"});
            return;
        }

        if (!title || !content) {
            res.status(400).json({ error: "title y content son Requeridos"});
            return;
        }

        const {data, error } = await updateNoteService(id, title, content, user_id);

        if (error) {
            console.error("Error Actualizando Nota:", error);
            res.status(500).json({ error: error.message});
            return;
        }

        res.status(200).json({ message: "Nota Actualizada Exitosamente", note: data});
    } catch (err){
        console.error("Error inesperado en updateNote:", err);
        res.status(500).json({ error: "Error Interno del Servidor"});
    }
};