import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bookmark, ArrowLeft } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

export function LoginForm({ onBack }: Props) {
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
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Volver al inicio</span>
          </button>
        )}
        
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="flex justify-center items-center gap-3 mb-8">
            <Bookmark className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-white">Me Link</h1>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
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
          
          <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
} 