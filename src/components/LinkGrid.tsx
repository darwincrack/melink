import React from 'react';
import { useLinkStore } from '../store/useLinkStore';
import { LinkListItem } from './LinkListItem';

export function LinkGrid() {
  const viewMode = useLinkStore((state) => state.viewMode);
  const { getFilteredLinks, isLoading, error } = useLinkStore();
  const filteredLinks = getFilteredLinks();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">Cargando enlaces...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (filteredLinks.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-400">No hay enlaces que coincidan con los filtros</div>
      </div>
    );
  }

  return (
    <div className={
      viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        : "flex flex-col gap-4"
    }>
      {filteredLinks.map((link) => (
        <LinkListItem key={link.id} link={link} viewMode={viewMode} />
      ))}
    </div>
  );
}