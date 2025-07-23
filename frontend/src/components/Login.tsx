import { useState } from "react";
import { login } from "../services/auth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  interface LoginResponse {
    message: string;
    token: string;
    user: {
      id: string;
      username: string;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try{
      const res = await login(username, password) as LoginResponse;
      console.log("Login OK:", res);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

    } catch (err: unknown){
      if (err instanceof Error){
        console.error(err.message);
      } else {
        console.error("Error desconocido", err);
      }
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Usuario" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
      <button type="submit">Login</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
};