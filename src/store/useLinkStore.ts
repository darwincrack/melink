import { create } from 'zustand';
import { Link } from '../types/link';

interface LinkStore {
  links: Link[];
  searchTerm: string;
  addLink: (link: Omit<Link, 'id' | 'createdAt'>) => void;
  removeLink: (id: string) => void;
  setSearchTerm: (term: string) => void;
  addTagToLink: (linkId: string, tag: string) => void;
  removeTagFromLink: (linkId: string, tag: string) => void;
}

export const useLinkStore = create<LinkStore>((set) => ({
  links: [],
  searchTerm: '',
  addLink: (linkData) => {
    set((state) => ({
      links: [
        {
          ...linkData,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        },
        ...state.links,
      ],
    }));
  },
  removeLink: (id) => {
    set((state) => ({
      links: state.links.filter((link) => link.id !== id),
    }));
  },
  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },
  addTagToLink: (linkId, tag) => {
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId
          ? { ...link, tags: [...new Set([...link.tags, tag])] }
          : link
      ),
    }));
  },
  removeTagFromLink: (linkId, tag) => {
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId
          ? { ...link, tags: link.tags.filter((t) => t !== tag) }
          : link
      ),
    }));
  },
}));