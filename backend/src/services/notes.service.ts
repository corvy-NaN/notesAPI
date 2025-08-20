import { executeInsert, getMany, executeNonQuery, getOne } from "../lib/databaseClient";

export const createNoteService = async (title: string, content: string, user_id: string) => {
    try {
        const query = `
            INSERT INTO Notes (Title, Content, UserId, CreatedAt, UpdatedAt)
            OUTPUT INSERTED.*
            VALUES (@title, @content, @userId, GETDATE(), GETDATE())
        `;

        const result = await executeInsert(query, {
            title,
            content,
            userId: user_id
        });

        return {
            data: result,
            error: null
        };
    } catch (error) {
        console.error("Database Error: ", error);
        return {
            data: null,
            error: { message: "Error en Base de Datos" }
        };
    }
};

export const getNotesService = async (user_id: string) => {
    try {
        const query = `
            SELECT Id, Title, Content, CreatedAt, UpdatedAt, UserId
            FROM Notes
            WHERE UserId = @userId
            ORDER BY UpdatedAt DESC
        `;

        const results = await getMany(query, { userId: user_id });

        return {
            data: results,
            error: null
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            data: null,
            error: { message: 'Error en Base de Datos' }
        };
    }
};

export const deleteNoteService = async (note_id: string, user_id: string) => {
    try {
        const query = `
            DELETE FROM Notes
            WHERE Id = @noteId AND UserId = @userId
        `;

        const rowsAffected = await executeNonQuery(query, {
            noteId: note_id,
            userId: user_id
        });

        if (rowsAffected === 0) {
            return {
                data: null,
                error: { message: "Nota no encontrada / No Autorizado" }
            };
        }

        return {
            data: { message: "Nota Eliminada Exitosamente" },
            error: null
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            data: null,
            error: { message: 'Error en Base de Datos' }
        };
    }
};

export const updateNoteService = async (
    note_id: string,
    title: string,
    content: string,
    user_id: string
) => {
    try {
        const query = `
            UPDATE Notes
            SET Title = @title, Content = @content, UpdatedAt = GETDATE()
            OUTPUT INSERTED.*
            WHERE Id = @noteId AND UserId = @userId
        `;

        const result = await executeInsert(query, {
            noteId: note_id,
            title,
            content,
            userId: user_id
        });

        if (!result) {
            return {
                data: null,
                error: { message: "Nota No Encontrada / No Autorizado" }
            };
        }

        return {
            data: result,
            error: null
        };
    } catch (error) {
        console.error('Database error:', error);
        return {
            data: null,
            error: { message: 'Error en Base de Datos' }
        };
    }
};