import { useEffect, useState } from "react";
import type {Note} from "../services/noteService";
import { getNotes, createNote, deleteNote} from "../services/noteService";
import CreateNoteForm from "../components/CreateNoteForm";
import EditNoteForm from "../components/EditNoteForm";

export default function NotesPage(){
    const [notes, setNotes] = useState<Note[]>([]);

    const loadNotes = async ()=> {
        try{
            const response = await getNotes();
            setNotes(response);
        } catch(error){
            alert("Error al cargar las notas");
            console.error(error);
        }
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const handleCreate = async (note: Omit<Note, "id">) => {
        try{
            await createNote(note as Note);
            loadNotes();
        } catch(error){
            alert("Error al Crear Nota");
            console.error(error);
        }
    };

    const handleDelete = async (id: number) => {
        try{
            await deleteNote(id);
            loadNotes();
        } catch(error){
            alert("Error al Eliminar Nota");
            console.error(error);
        }
    };

    const [noteBeingEdited, setNoteBeingEdited] = useState<Note | null>(null);

    return (
        <div>
            <h1>Mis Notas</h1>
            {noteBeingEdited ? (
                <EditNoteForm
                note={noteBeingEdited}
                onCancel={()=> setNoteBeingEdited(null)}
                onNoteUpdated={()=>{
                    setNoteBeingEdited(null);
                    loadNotes();
                }}
                />
            ):(
            <CreateNoteForm onNoteCreated={handleCreate} />
            )}
            <ul>
                {notes.map((note) => (
                    <li key={note.id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        <button onClick={() => setNoteBeingEdited(note)}>Editar</button>
                        <button onClick={() => handleDelete(note.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}