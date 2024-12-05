import React, { useEffect } from 'react';
import { LinkForm } from './components/LinkForm';
import { AdvancedSearch } from './components/AdvancedSearch';
import { LinkGrid } from './components/LinkGrid';
import { LoginForm } from './components/LoginForm';
import { LandingPage } from './components/LandingPage';
import { Bookmark, LogOut } from 'lucide-react';
import { useLinkStore } from './store/useLinkStore';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const fetchLinks = useLinkStore((state) => state.fetchLinks);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user, fetchLinks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="text-blue-400" size={32} />
              <h1 className="text-3xl font-bold text-white">Me Link</h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
          <p className="text-gray-400">
            Guarde y organice sus enlaces favoritos con vistas previas y etiquetas.
          </p>
        </header>

        <main>
          <LinkForm />
          <AdvancedSearch />
          <LinkGrid />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;