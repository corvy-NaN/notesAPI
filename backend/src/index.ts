import app from "./app";


const PORT = 3001;

const server = app.listen(PORT, () => {
    console.log(`Servidor backend en http://localhost:${PORT}`);
});

export default server;