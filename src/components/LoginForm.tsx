import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        setError('¡Registro exitoso!');
        setIsLogin(true);
      }
    } catch (error) {
      let errorMessage = 'Error de autenticación';
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'Invalid login credentials':
            errorMessage = 'Credenciales inválidas';
            break;
          case 'User already registered':
            errorMessage = 'El usuario ya está registrado';
            break;
          case 'Email not confirmed':
            errorMessage = 'Email no confirmado';
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        {error && (
          <div className={`mb-4 p-3 rounded border ${
            error === '¡Registro exitoso!' 
              ? 'bg-green-500/10 border-green-500 text-green-500'
              : 'bg-red-500/10 border-red-500 text-red-500'
          }`}>
            {error}
          </div>
        )}
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white border border-gray-600"
          disabled={loading}
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full mb-6 p-2 rounded bg-gray-700 text-white border border-gray-600"
          disabled={loading}
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
        
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4 text-gray-400 hover:text-white"
          disabled={loading}
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
    </div>
  );
} 