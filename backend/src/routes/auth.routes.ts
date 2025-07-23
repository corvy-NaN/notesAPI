import { Router } from 'express';
import { loginUser, registerUser } from '../controllers/auth.controller';
import { supabase } from '../lib/supabaseClient';

const router = Router();

router.post('/login', loginUser);
router.post('/register', registerUser);


router.get('/test', (req, res) => {
    res.json({ message: "Servidor funcionando", timestamp: new Date() });
});

router.get('/test-db', async (req, res): Promise<void> => {
    try {
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .limit(1);
            
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }
        
        res.json({ message: 'DB OK', data });
    } catch (err) {
        res.status(500).json({ error: 'Error inesperado', details: err });
    }
});

export default router;