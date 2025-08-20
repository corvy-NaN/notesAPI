import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import type { AuthResponse } from "../types/auth";
import { login as loginService, register as registerService } from "../services/auth"

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

   const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/notes");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      let res: AuthResponse;
      
      if (isLoginMode) {
        res = await loginService(username, password);
      } else {
        res = await registerService({ username, password, email });
      }
      
      login(res.token, res.user);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 bg-gray-700 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {error && (
          <div className="bg-red-600 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Usuario"
            className="w-full px-3 py-2 bg-gray-600 text-white rounded"
            required
          />
          
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            type="password"
            className="w-full px-3 py-2 bg-gray-600 text-white rounded"
            required
          />
          
          {!isLoginMode && (
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email (opcional)"
              type="email"
              className="w-full px-3 py-2 bg-gray-600 text-white rounded"
            />
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-500 hover:bg-purple-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading 
              ? (isLoginMode ? 'Iniciando...' : 'Registrando...') 
              : (isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta')
            }
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">
            {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
          <button 
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError(null);
              setEmail("");
            }}
            className="text-blue-400 hover:text-blue-300"
          >
            {isLoginMode ? 'Crear una cuenta' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};