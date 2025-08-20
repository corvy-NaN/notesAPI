import { Router } from "express";
import { executeQuery, getMany, getOne, testConnection } from "../lib/databaseClient";

const router = Router();

router.get('/server', (req, res) => {
    res.json({
        message: "Servidor Funcionando Correctamente",
        timestamp: new Date(),
        environment: process.env.NODE_ENV || 'development'
    });
});

router.get('/database', async (req, res): Promise<void> => {
    try {
        const result = await testConnection();
        
        if (result.success) {
            res.json({
                message: 'Conexion a SQL Server OK',
                server: 'CORVY\\SQLEXPRESS',
                database: 'NotesDB',
                timestamp: new Date(),
                status: 'connected',
                data: result.data
            });
        } else {
            throw result.error;
        }
    } catch (err) {
        console.error("Error Conectando SQL Server", err);
        res.status(500).json({
            error: 'Error Conectando SQL Server',
            details: err instanceof Error ? err.message : 'Error Desconocido',
            status: 'disconnected'
        });
    }
});

router.get('/notes-sample', async (req, res): Promise<void> => {
    try {
        const notes = await getMany(`
            SELECT TOP 3 Id, Title, Content, CreatedAt, UserId
            FROM Notes
            ORDER BY CreatedAt DESC
        `);

        const countResult = await getOne('SELECT COUNT(*) as TotalNotes FROM Notes');

        res.json({
            message: 'Consulta de Notas Exitosa',
            data: notes,
            totalNotes: countResult?.TotalNotes || 0,
            status: 'success'
        });
    } catch (err) {
        console.error('Error Consultando Notas:', err);
        res.status(500).json({
            error: 'Error Consultando Notas',
            details: err instanceof Error ? err.message : 'Error Desconocido'
        });
    }
});

router.get('/users-sample', async (req, res): Promise<void> => {
    try {
        const users = await getMany(`
            SELECT TOP 3 Id, Username, Email, CreatedAt
            FROM Users
            ORDER BY CreatedAt DESC
        `);

        const countResult = await getOne('SELECT COUNT(*) as TotalUsers FROM Users');

        res.json({
            message: 'Consulta de Usuarios Exitosa',
            data: users,
            totalUsers: countResult?.TotalUsers || 0,
            status: 'success'
        });
    } catch (err) {
        console.error('Error Consultando Usuarios', err);
        res.status(500).json({
            error: 'Error Consultando Usuarios',
            details: err instanceof Error ? err.message : 'Error Desconocido'
        });
    }
});

export default router;