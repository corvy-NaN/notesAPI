import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { getMany } from '../lib/databaseClient';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

router.get('/test', (req, res) => {
    res.json({ message: "Servidor funcionando", timestamp: new Date() });
});

router.get('/test-db', async (req, res): Promise<void> => {
    try {
        const result = await getMany(`
            SELECT TOP 1 Id, Title, Content, CreatedAt
            FROM Notes
            ORDER BY CreatedAt DESC
        `);

        res.json({
            message: "DB OK",
            data: result,
            server: "SQL Server",
            database: "NotesDB"
        });
    } catch (err) {
        console.error("Error en test-db: ", err);
        res.status(500).json({
            error: 'Error Conectando SQL Server',
            details: err instanceof Error ? err.message : "Error Desconocido"
        });
    }
});

export default router;