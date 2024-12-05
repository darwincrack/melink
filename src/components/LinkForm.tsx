import React, { useState } from 'react';
import { useLinkStore } from '../store/useLinkStore';

export function LinkForm() {
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const addLink = useLinkStore((state) => state.addLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validar que la URL sea un string y no esté vacía
      if (typeof url !== 'string' || !url.trim()) {
        throw new Error('Por favor, ingresa una URL válida');
      }

      const tagArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      await addLink(url.trim(), tagArray);
      
      setUrl('');
      setTags('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar el enlace';
      setError(errorMessage);
      console.error('Error al agregar el enlace:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500 rounded text-red-500">
            {error}
          </div>
        )}
        <div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Ingresa una URL"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Etiquetas (separadas por comas)"
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Agregar enlace
        </button>
      </div>
    </form>
  );
}