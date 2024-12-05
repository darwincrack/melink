import React from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { LinkCard } from './LinkCard';
import { LinkListItem } from './LinkListItem';

export function LinkGrid() {
  const { viewMode, getFilteredLinks } = useLinkStore();
  const filteredLinks = getFilteredLinks();

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {filteredLinks.map((link) => (
          <LinkListItem key={link.id} link={link} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-3 gap-5">
      {filteredLinks.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}