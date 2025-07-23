import api from "./api";

export interface Note{
    id: number;
    title: string;
    content: string;
}

/*
export const noteService = {
    getNotes: (): Promise<PaginatedResponse<Note>> => 
        api.get('/notes'),
    
    createNoteDto: (noteData: CreateNoteDto): Promise<ApiResponse<Note>> => 
        api.post('/notes', noteData),
    
    updateNote: (id: number, noteData: updateNoteDto): Promise<ApiResponse<Note>> =>
        api.put(`/notes/${id}`, noteData),

    deleteNote: (id: number): Promise<ApiResponse<void>> => 
        api.delete(`/notes/${id}`),

    searchNotes: (query: string): Promise<PaginatedResponse<Note>> => 
        api.post(`/notes/search`, searchData)
};
*/

export const getNotes = async (): Promise<Note[]> => {
    const response = await api.get<Note[]>("/notes");
    return response.data;
};
    
export const createNote = async (note: Note): Promise<Note> => {
    const response = await api.post<Note>("/notes", note);
    return response.data;
};

export const deleteNote = async (id: number): Promise<void> => {
    await api.delete(`/notes/${id}`);
};

export const updateNote = async (id: number, note: Note): Promise<Note> => {
    const response = await api.put<Note>(`/notes/${id}`, note);
    return response.data;
};