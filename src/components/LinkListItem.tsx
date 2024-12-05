import React from 'react';
import { Link } from '../types/link';
import { useLinkStore } from '../store/useLinkStore';
import { X, Tag } from 'lucide-react';
import { cn } from '../utils/cn';

interface LinkListItemProps {
  link: Link;
}

export function LinkListItem({ link }: LinkListItemProps) {
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
    <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4">
      <div className="h-12 w-12 flex-shrink-0">
        {link.image ? (
          <img
            src={link.image}
            alt={link.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white truncate">{link.title}</h3>
          <button
            onClick={() => removeLink(link.id)}
            className="text-gray-400 hover:text-red-400 flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-400 text-sm line-clamp-1 mb-2">{link.description}</p>

        <div className="flex flex-wrap gap-2 items-center">
          <Tag size={16} className="text-gray-400" />
          {link.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "px-2 py-1 rounded-full text-sm",
                "bg-blue-900 text-blue-300"
              )}
            >
              {tag}
              <button
                onClick={() => removeTagFromLink(link.id, tag)}
                className="ml-1 text-blue-400 hover:text-blue-200"
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
            className="text-sm px-2 py-1 rounded-full bg-gray-700 text-white border border-gray-600 
            focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
} 