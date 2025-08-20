import express from "express";
import authRoutes from "./routes/auth.routes";
import notesRoutes from "./routes/notes.routes";
import testRoutes from "./routes/test.routes";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/test", testRoutes);
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.get("/", (_req, res) => {
    res.send("API FUNCIONANDO");
});

export default app;
