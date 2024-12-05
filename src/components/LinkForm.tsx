import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLinkStore } from '../store/useLinkStore';
import { getURLMetadata } from '../utils/metadata';

export function LinkForm() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const addLink = useLinkStore((state) => state.addLink);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      const metadata = await getURLMetadata(url);
      
      addLink({
        url,
        title: metadata.title,
        description: metadata.description,
        image: metadata.favicon,
        tags: [],
      });

      setUrl('');
    } catch (error) {
      console.error('Error adding link:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL here..."
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-2"
      >
        <Plus size={20} />
        {loading ? 'Loading...' : 'Add Link'}
      </button>
    </form>
  );
}