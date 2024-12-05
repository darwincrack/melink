import React, { useState, KeyboardEvent } from 'react';
import { Trash2, Plus, X } from 'lucide-react';
import { useLinkStore } from '../store/useLinkStore';

interface Link {
  id: number;
  url: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  created_at: string;
}

interface Props {
  link: Link;
  viewMode: 'grid' | 'list';
}

export function LinkListItem({ link, viewMode }: Props) {
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const { deleteLink, updateLinkTags } = useLinkStore();

  const handleDelete = async () => {
    try {
      await deleteLink(link.id);
    } catch (error) {
      console.error('Error al eliminar el enlace:', error);
    }
  };

  const handleAddTag = async () => {
    if (newTag.trim()) {
      await updateLinkTags(link.id, [...(link.tags || []), newTag.trim()]);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    const newTags = link.tags.filter(tag => tag !== tagToRemove);
    await updateLinkTags(link.id, newTags);
  };

  const containerClass = viewMode === 'grid'
    ? "bg-gray-800 rounded-lg overflow-hidden shadow-lg"
    : "bg-gray-800 rounded-lg overflow-hidden shadow-lg flex gap-4";

  const imageClass = viewMode === 'grid'
    ? "w-full h-32 object-cover"
    : "w-24 h-24 object-cover flex-shrink-0";

  return (
    <div className={containerClass}>
      {link.image && (
        <img
          src={link.image}
          alt={link.title}
          className={imageClass}
        />
      )}
      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            {link.title}
          </a>
        </h3>
        <p className="text-gray-400 text-sm mb-4">{link.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {link.tags?.map((tag) => (
            <span
              key={tag}
              className="group px-2 py-1 bg-gray-700 text-gray-300 text-sm rounded-full flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="opacity-0 group-hover:opacity-100 hover:text-red-400"
                title="Eliminar etiqueta"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          {isAddingTag ? (
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => {
                handleAddTag();
                setIsAddingTag(false);
              }}
              className="px-2 py-1 bg-gray-700 text-white text-sm rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Nueva etiqueta..."
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsAddingTag(true)}
              className="px-2 py-1 text-gray-400 hover:text-white text-sm rounded-full flex items-center gap-1"
            >
              <Plus size={14} />
              Agregar etiqueta
            </button>
          )}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm">
            {new Date(link.created_at).toLocaleDateString()}
          </span>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Eliminar enlace"
            aria-label="Eliminar enlace"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} 