import request from "supertest";
import app from "../src/app";

describe("POST /auth/login", () => {
    it("debería loguear correctamente con credenciales válidas", async() => {
        const res = await request(app)
        .post("/auth/login")
        .send({
            username: "dummy",
            password: "123456"
        });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.user).toHaveProperty("username", "dummy");
    });

    it("debería fallar si faltan credenciales", async () => {
        const res = await request(app)
        .post("/auth/login")
        .send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message");
    });

    it("debería fallar con credenciales inválidas", async () => {
        const res = await request(app)
        .post("/auth/login")
        .send({
            username: "dummy",
            password: "contraseñaMal"
        });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty("message");
    });
});