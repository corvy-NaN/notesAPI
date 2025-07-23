import React, { useEffect, useState } from "react";
import { getNotes, deleteNote, updateNote} from "../services/noteService";
import type { Note } from "../services/noteService";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";

interface NotesListProps{
  refreshTrigger?: boolean;
}

const NotesList: React.FC<NotesListProps> = ({refreshTrigger}) => {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token){
        navigate("/login");
      }
    });


    const [notes, setNotes] = useState<Note[]>([]);
    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedContent, setEditedContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchNotes = async () => {
          try{
            const notes = await getNotes();
            setNotes(notes);
          }catch(error){
            console.error("Error al obtener Notas ", error);
            alert("Error al Cargar Notas");
          }
        };

        fetchNotes();
    }, [refreshTrigger]);

    useEffect(() => {
      const getAllNotes = async () => {
        try{
          setIsLoading(true);
          setError(null);
          const data = await getNotes();
          setNotes(data);
        }catch (error){
          console.error("Error al cargar Notas", error);
          alert("Error al cargar Notas");
        } finally{
          setIsLoading(false);
        }
      };
      getAllNotes();
    }, []);

    if (isLoading){
      return <p className="text-center text-gray-500 mt-4 break-words">Cargando Notas...</p>;
    }

    const handleDelete = async (id: number) => {
      const confirmed = window.confirm("Estás Seguro de Eliminar la Nota?");
      if (!confirmed) return;
      
      try{
        await deleteNote(id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }catch(error){
        alert("Error al Eliminar Nota");
        console.error(error);
      }
    };

    const startEditing = (notes: Note) => {
      setEditingNoteId(notes.id);
      setEditedTitle(notes.title);
      setEditedContent(notes.content);
    };

    const cancelEditing = () => {
      setEditingNoteId(null);
      setEditedTitle("");
      setEditedContent("");
    };

    const saveChanges = async (id: number) => {
      try {
      const updatedNote: Note = { id, title: editedTitle, content: editedContent };
      const result = await updateNote(id, updatedNote);
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? result : note))
      );
      cancelEditing();
      }catch(error){
        alert("Error al Actualizar Nota");
        console.error(error);
      }
    };

    const handleLogout = () => {
      logout();
      localStorage.removeItem("token");
      console.log("Sesión cerrada");
      window.location.href = "/login";
    };

    return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <div className="flex justify-between items-center">
      <h2 className="flex text-xl font-semibold text-white">Notas</h2>
      <button
        onClick={handleLogout}
        className="ml-auto text-sm text-white bg-red-600 hover:underline block mb-2 px-2 py-1 rounded"
      >
        Cerrar sesión
      </button>
      </div>
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
          </div>
        )}
      {notes.length === 0 ? (
        <p>No Hay Notas Disponibles</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} className="text-white dark:bg-purple-900 p-4 rounded shadow-md">
            {editingNoteId === note.id ? (
              <>
                <input
                  className="block w-full mb-2 border px-2 py-1"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <textarea
                  className="block w-full mb-2 border px-2 py-1"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
                <div className="space-x-2">
                  <button
                    className="text-sm text-green-600 hover:underline"
                    onClick={() => saveChanges(note.id)}
                  >
                    Guardar
                  </button>
                  <button
                    className="text-sm text-gray-600 hover:underline"
                    onClick={cancelEditing}
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold">{note.title}</h3>
                <p>{note.content}</p>
                <div className="flex gap-2 mt-2 space-x-2">
                  <button
                    className="text-sm bg-green-500 hover:underline px-2 py-1 rounded"
                    onClick={() => startEditing(note)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-sm bg-red-600 hover:underline px-2 py-1 rounded"
                    onClick={() => handleDelete(note.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default NotesList;