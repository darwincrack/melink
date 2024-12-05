import React, { useEffect } from 'react';
import { LinkForm } from './components/LinkForm';
import { SearchBar } from './components/SearchBar';
import { LinkGrid } from './components/LinkGrid';
import { Bookmark } from 'lucide-react';
import { useLinkStore } from './store/useLinkStore';

function App() {
  const fetchLinks = useLinkStore((state) => state.fetchLinks);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="text-blue-400" size={32} />
            <h1 className="text-3xl font-bold text-white">Me Link</h1>
          </div>
          <p className="text-gray-400">
            Guarde y organice sus enlaces favoritos con vistas previas y etiquetas.
          </p>
        </header>

        <main>
          <LinkForm />
          <SearchBar />
          <LinkGrid />
        </main>
      </div>
    </div>
  );
}

export default App;