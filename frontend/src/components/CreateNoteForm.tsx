import React, { useState } from "react";
import { createNote } from "../services/noteService";
import type {Note} from "../services/noteService";


interface CreateNoteFormProps{
    onNoteCreated: (note: Note) => void;
    onCancel?: () => void;
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({ onNoteCreated, onCancel }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()){
            setMessage({type: 'error', text: 'Completa Todos los Campos'});
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        try{
            setIsLoading(true);
            setMessage(null);

            const newNote = await createNote({ title: title.trim(), content: content.trim() });
            
            onNoteCreated(newNote);
            setTitle("");
            setContent("");

            setMessage({type: 'success', text: 'Nota Creada Exitosamente'});
            setTimeout(() => setMessage(null), 3000);

          }catch(error) {
            setMessage({type: 'error', text: 'Error al Crear Nota'});
            setTimeout(() => setMessage(null), 3000);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

      return (
    <form 
       onSubmit={handleSubmit}
       className="space-y-4 p-4 bg-gray-800 rounded shadow-md mb-4"
    >
      <h2 className="text-xl font-semibold text-white">Crear Nueva Nota</h2>
      
      {message && (
        <div className={`p-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {message.text}
        </div>
      )}

       <input 
         type="text"
         placeholder="Título"
         value={title}
         onChange={(e) => setTitle(e.target.value)}
         className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        disabled={isLoading}
      />

       <textarea 
         placeholder="Contenido"
         value={content}
         onChange={(e) => setContent(e.target.value)}
         className="w-full p-2 border rounded bg-gray-700 text-white placeholder-gray-400"
        rows={4}
        disabled={isLoading}
      />
             
       <div className="flex gap-2">
        <button 
           type="submit"
           className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
          disabled={isLoading || !title.trim() || !content.trim()}
        >
          {isLoading ? "Creando..." : "Crear Nota"}
        </button>
                 
        {onCancel && (
          <button 
             type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition duration-200"
            disabled={isLoading}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CreateNoteForm;