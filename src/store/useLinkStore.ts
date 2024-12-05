import { create } from 'zustand';
import { supabase } from '../config/supabase';
import { Link } from '../types/link';

interface LinkStore {
  links: Link[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addLink: (link: Omit<Link, 'id'>) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  addTagToLink: (linkId: string, tag: string) => Promise<void>;
  removeTagFromLink: (linkId: string, tag: string) => Promise<void>;
  fetchLinks: () => Promise<void>;
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  links: [],
  searchTerm: '',
  
  setSearchTerm: (term) => set({ searchTerm: term }),

  fetchLinks: async () => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching links:', error);
      return;
    }

    set({ links: data });
  },

  addLink: async (linkData) => {
    const { data, error } = await supabase
      .from('links')
      .insert([linkData])
      .select()
      .single();

    if (error) {
      console.error('Error adding link:', error);
      return;
    }

    set((state) => ({
      links: [data, ...state.links]
    }));
  },

  removeLink: async (id) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing link:', error);
      return;
    }

    set((state) => ({
      links: state.links.filter((link) => link.id !== id)
    }));
  },

  addTagToLink: async (linkId, tag) => {
    const link = get().links.find((l) => l.id === linkId);
    if (!link) return;

    const updatedTags = [...new Set([...link.tags, tag])];
    
    const { error } = await supabase
      .from('links')
      .update({ tags: updatedTags })
      .eq('id', linkId);

    if (error) {
      console.error('Error adding tag:', error);
      return;
    }

    set((state) => ({
      links: state.links.map((l) =>
        l.id === linkId ? { ...l, tags: updatedTags } : l
      )
    }));
  },

  removeTagFromLink: async (linkId, tagToRemove) => {
    const link = get().links.find((l) => l.id === linkId);
    if (!link) return;

    const updatedTags = link.tags.filter((tag) => tag !== tagToRemove);
    
    const { error } = await supabase
      .from('links')
      .update({ tags: updatedTags })
      .eq('id', linkId);

    if (error) {
      console.error('Error removing tag:', error);
      return;
    }

    set((state) => ({
      links: state.links.map((l) =>
        l.id === linkId ? { ...l, tags: updatedTags } : l
      )
    }));
  },
}));