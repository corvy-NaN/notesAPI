import { supabase } from "../lib/supabaseClient";

export const createNoteService = async (title: string, content: string, user_id: string) => {
    return await supabase.from("notes").insert([{ title, content, user_id}]);
};

export const getNotesService = async (user_id: string) => {
    return await supabase.from("notes").select("*").eq("user_id", user_id);
};

export const deleteNoteService = async (note_id: string, user_id: string) => {
    return await supabase
    .from("notes")
    .delete()
    .eq("id", note_id)
    .eq("user_id", user_id)
};

export const updateNoteService = async (
    note_id: string,
    title: string,
    content: string,
    user_id: string
) => {
    return await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", note_id)
    .eq("user_id", user_id)
};