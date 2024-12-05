import React from 'react';
import { LinkForm } from './components/LinkForm';
import { SearchBar } from './components/SearchBar';
import { LinkGrid } from './components/LinkGrid';
import { Bookmark } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Me Link</h1>
          </div>
          <p className="text-gray-600">
            Save and organize your favorite links with previews and tags
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