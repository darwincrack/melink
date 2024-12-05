import React from 'react';
import { Search } from 'lucide-react';
import { useLinkStore } from '../store/useLinkStore';

export function SearchBar() {
  const { searchTerm, setSearchTerm } = useLinkStore((state) => ({
    searchTerm: state.searchTerm,
    setSearchTerm: state.setSearchTerm,
  }));

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca enlaces por título, descripción o etiquetas..."
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 
        focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400"
      />
    </div>
  );
}