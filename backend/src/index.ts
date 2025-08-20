import dotenv from 'dotenv';
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

const server = app.listen(PORT, () => {
    console.log(`Servidor backend en http://${HOST}:${PORT}`);
});

export default server;