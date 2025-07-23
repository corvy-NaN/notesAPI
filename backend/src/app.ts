import express from "express";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.get("/", (_req, res) => {
    res.send("API FUNCIONANDO");
});

export default app;
