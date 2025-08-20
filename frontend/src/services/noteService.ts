import api from "./api";

export interface Note{
    id: number;
    title: string;
    content: string;
    createdAt?: string;
    updateAt?: string;
    userId?: number;
}

interface RawNote {
    Id: number;
    Title: string;
    Content: string;
    CreatedAt?: string;
    UpdateAt?: string;
    UserId?: number;
}

interface RawNotesResponse{
    message?: string;
    notes?: RawNote[];
    [key: number]: RawNote;
}

interface RawNoteResponse{
    message?: string;
    note?: RawNote;
    Id?: number;
    Title?: string;
    Content?: string;
    CreatedAt?: string;
    UserId?: number;
}

export const getNotes = async (): Promise<Note[]> => {
    try {
        const response = await api.get<RawNotesResponse | RawNote[]>("/notes");
        let rawNotes: RawNote[];

        if (Array.isArray(response.data)) {
            rawNotes = response.data;
        } else if (response.data.notes) {
            rawNotes = response.data.notes;
        } else {
            rawNotes = [];
        }

        const mappedNotes =  rawNotes.map((note: RawNote) => ({
            id: note.Id,
            title: note.Title,
            content: note.Content,
            createdAt: note.CreatedAt,
            upadateAt: note.UpdateAt,
            userId: note.UserId
        }));

        return mappedNotes;
    } catch (error){
        console.error("Error en getNotes", error);
        throw error;
    }
};
    
export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
    const response = await api.post<RawNoteResponse>("/notes", note);
    let rawNote: RawNote;

    if (response.data.note) {
        rawNote = response.data.note;
    } else {
        rawNote = response.data as RawNote;
    }

    return {
        id: rawNote.Id,
        title: rawNote.Title,
        content: rawNote.Content,
        createdAt: rawNote.CreatedAt,
        updateAt: rawNote.UpdateAt,
        userId: rawNote.UserId
    };
};

export const deleteNote = async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
};

export const updateNote = async (id: number, note: Note): Promise<Note> => {
    const response = await api.put<RawNoteResponse>(`/notes/${id}`, note);
    let rawNote: RawNote;

     if (response.data.note) {
        rawNote = response.data.note;
    } else {
        rawNote = response.data as RawNote;
    }

    return {
            id: rawNote.Id,
            title: rawNote.Title,
            content: rawNote.Content,
            createdAt: rawNote.CreatedAt,
            updateAt: rawNote.UpdateAt,
            userId: rawNote.UserId
    }
};