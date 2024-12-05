import React from 'react';
import { Tag, X } from 'lucide-react';
import { Link } from '../types/link';
import { useLinkStore } from '../store/useLinkStore';
import { cn } from '../utils/cn';

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const { removeLink, addTagToLink, removeTagFromLink } = useLinkStore();
  const [newTag, setNewTag] = React.useState('');

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTagToLink(link.id, newTag.trim());
      setNewTag('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-12 relative bg-gray-100 flex items-center justify-center p-2">
        {link.image ? (
          <img
            src={link.image}
            alt={link.title}
            className="h-full w-auto object-contain"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded" />
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{link.title}</h3>
          <button
            onClick={() => removeLink(link.id)}
            className="text-gray-400 hover:text-red-500 flex-shrink-0 ml-2"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{link.description}</p>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600 text-sm mb-4 block truncate"
        >
          {link.url}
        </a>
        <div className="flex flex-wrap gap-2 items-center">
          <Tag size={16} className="text-gray-400" />
          {link.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 rounded-full text-sm",
                "bg-blue-100 text-blue-700"
              )}
            >
              {tag}
              <button
                onClick={() => removeTagFromLink(link.id, tag)}
                className="ml-1 text-blue-400 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tag..."
            className="text-sm px-2 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}