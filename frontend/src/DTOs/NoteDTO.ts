export interface createNoteDto {
    title: string;
    content: string;
}

export interface updateNoteDto{
    title?: string;
    content?: string;
}

export interface NoteSearchDto {
    query: string;
    limit?: number;
    offset?: number;
}