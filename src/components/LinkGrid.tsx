import React from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { LinkCard } from './LinkCard';

export function LinkGrid() {
  const { links, searchTerm } = useLinkStore();

  const filteredLinks = links.filter((link) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      link.title.toLowerCase().includes(searchLower) ||
      link.description.toLowerCase().includes(searchLower) ||
      link.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredLinks.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}