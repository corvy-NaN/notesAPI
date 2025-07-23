import { useState } from "react";
import { createNote } from "../services/noteService";
import type {Note} from "../services/noteService";

const CreateNoteForm = ({ onNoteCreated }: {onNoteCreated: (note: Omit<Note, "id">) => void}) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()){
            alert("Por favor completa todos los campos");
            return;
        }

        try{
            await createNote({title, content, id: 0 });
            alert("Nota creada con Exito");
            setTitle("");
            setContent("");
            onNoteCreated({title, content});
        }catch(error) {
            alert("Error al crear Nota");
            console.error(error);
        }
    };
    return(
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md max-w-md mx-auto">
            <h2 className="text-xl font-semibold">Crear Nueva Nota</h2>

            <input type="text" placeholder="Titulo" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />

            <textarea placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" rows={4} />
            
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Crear Nota
            </button>
        </form>
    );
};

export default CreateNoteForm;