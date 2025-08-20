import React, { useEffect, useState } from "react";
import { getNotes, deleteNote, updateNote} from "../services/noteService";
import type { Note } from "../services/noteService";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/auth";
import CreateNoteForm from "./CreateNoteForm";

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
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState<string | null>(null);


    useEffect(() => {
      const getAllNotes = async () => {
        try{
          setIsLoading(true);
          setError(null);
          const data = await getNotes();
          
          if(Array.isArray(data)) {
            setNotes(data);
          } else {
            console.error("Respuesta no es Array:", data);
            setNotes([]);
            setError("Error Formato de Datos");
          }
        }catch (error){
          console.error("Error al cargar Notas", error);
          setNotes([]);
          setError("Error al cargar Notas");
        } finally{
          setIsLoading(false);
        }
      };
      getAllNotes();
    }, [refreshTrigger]);

    if (isLoading){
      return <p className="text-center text-gray-500 mt-4 break-words">Cargando Notas...</p>;
    }

    const handleDelete = async (id: number) => {
      const confirmed = window.confirm("Estás Seguro de Eliminar la Nota?");
      if (!confirmed) return;
      
      try{
        await deleteNote(id);
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));

        setDeleteMessage("Nota Eliminada Exitosamente");
        setTimeout(() => setDeleteMessage(null), 3000);
      }catch(error){
        setDeleteMessage("Error al Eliminar Nota");
        setTimeout(() => setDeleteMessage(null), 3000);
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

    const handleNoteCreated = (newNote: Note) => {
      setNotes(prevNotes => [...prevNotes, newNote]);
      setShowCreateForm(false);
    };

    const handleLogout = () => {
      logout();
      localStorage.removeItem("token");
      console.log("Sesión cerrada");
      window.location.href = "/login";
    };

    return (
  <div className="min-h-screen bg-gray-900 py-6">
    <div className="max-w-4xl mx-auto px-4">
      <header className="mb-6">
        {deleteMessage && (
          <div className="mb-4">
            <div className="bg-green-600 text-white px-4 py-2 rounded">
              {deleteMessage}
            </div>
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Mis Notas</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
            >
              Nueva Nota
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
            >
              Salir
            </button>
          </div>
        </div>
      </header>
      {error && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        </div>
      )}
      {showCreateForm && (
        <section className="mb-6">
          <CreateNoteForm
            onNoteCreated={handleNoteCreated}
            onCancel={() => setShowCreateForm(false)}
          />
        </section>
      )}
      <main>
        {notes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-medium text-gray-300 mb-2">
              No Tienes Notas Todavía
            </h3>
            <p className="text-gray-400 mb-4">
              Comienza Creando tu Primera Nota
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              Crear mi Primera Nota
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div 
                key={note.id} 
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {editingNoteId === note.id ? (
                  <div className="space-y-3">
                    <input
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded"
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => saveChanges(note.id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                        onClick={cancelEditing}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{note.title}</h3>
                    <p className="text-gray-300 mb-4">{note.content}</p>
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => startEditing(note)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        onClick={() => handleDelete(note.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  </div>
);
};

export default NotesList;