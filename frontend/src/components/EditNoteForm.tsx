import { useState } from "react";
import { updateNote}  from "../services/noteService";
import type {Note} from "../services/noteService";

interface EditNoteFormProps{
    note: Note,
    onCancel: ()=> void;
    onNoteUpdated: ()=> void;
}

const EditNoteForm = ({note, onCancel, onNoteUpdated}: EditNoteFormProps) => {
    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            await updateNote(note.id, { ...note, title, content});
            alert("Nota Actualizada");
            onNoteUpdated();
        }catch(error){
            alert("Error al Actualizar");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold">Editar Nota</h2>

        <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        className="w-full p-2 border rounded"
        />
        <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
        rows={4}
        />

            <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
                    Guardar
                </button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default EditNoteForm;