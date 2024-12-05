import { create } from 'zustand';
import { Link } from '../types/link';
import { supabase } from '../config/supabase';

interface FilterOptions {
  searchTerm: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'date' | 'title' | 'tags';
  sortOrder: 'asc' | 'desc';
}

interface LinkStore {
  links: Link[];
  searchTerm: string;
  viewMode: 'grid' | 'list';
  filters: FilterOptions;
  allTags: string[];
  setSearchTerm: (term: string) => void;
  addLink: (link: Omit<Link, 'id'>) => Promise<void>;
  removeLink: (id: string) => Promise<void>;
  addTagToLink: (linkId: string, tag: string) => Promise<void>;
  removeTagFromLink: (linkId: string, tag: string) => Promise<void>;
  fetchLinks: () => Promise<void>;
  setViewMode: (mode: 'grid' | 'list') => void;
  setFilters: (filters: FilterOptions) => void;
  getFilteredLinks: () => Link[];
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  links: [],
  searchTerm: '',
  viewMode: 'grid',
  filters: {
    searchTerm: '',
    tags: [],
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  },
  allTags: [],
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilters: (filters) => set({ filters }),

  fetchLinks: async () => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching links:', error);
      return;
    }

    // Extraer todas las etiquetas únicas
    const tags = new Set<string>();
    data.forEach(link => link.tags.forEach(tag => tags.add(tag)));

    set({ 
      links: data,
      allTags: Array.from(tags)
    });
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

  removeTagFromLink: async (linkId, tag) => {
    const link = get().links.find((l) => l.id === linkId);
    if (!link) return;

    const updatedTags = link.tags.filter((t) => t !== tag);
    
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

  getFilteredLinks: () => {
    const { links, filters } = get();
    let filtered = [...links];

    // Filtrar por término de búsqueda
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(search) ||
        link.description.toLowerCase().includes(search) ||
        link.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Filtrar por etiquetas
    if (filters.tags.length > 0) {
      filtered = filtered.filter(link =>
        filters.tags.every(tag => link.tags.includes(tag))
      );
    }

    // Filtrar por fecha
    const now = new Date();
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(link => 
          new Date(link.created_at).toDateString() === now.toDateString()
        );
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(link => 
          new Date(link.created_at) >= weekAgo
        );
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(link => 
          new Date(link.created_at) >= monthAgo
        );
        break;
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return filters.sortOrder === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'tags':
          return filters.sortOrder === 'asc'
            ? a.tags.length - b.tags.length
            : b.tags.length - a.tags.length;
        default: // date
          return filters.sortOrder === 'asc'
            ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }
}));