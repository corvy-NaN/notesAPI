import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/notes.controller";

const router = Router();

router.post('/', verifyToken, createNote);
router.get('/', verifyToken, getNotes);
router.delete('/:id', verifyToken, deleteNote);
router.put('/:id', verifyToken, updateNote);

export default router;