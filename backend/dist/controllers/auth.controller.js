"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = void 0;
const loginUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "Faltan datos" });
        return;
    }
    res.json({ message: "Credenciales Inválidas" });
};
exports.loginUser = loginUser;
