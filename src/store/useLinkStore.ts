import { create } from 'zustand';
import { supabase } from '../config/supabase';
import { getURLMetadata } from '../utils/metadata';

interface Link {
  id: number;
  url: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  user_id: string;
  created_at: string;
}

interface LinkStore {
  links: Link[];
  isLoading: boolean;
  error: string | null;
  viewMode: 'grid' | 'list';
  filters: {
    searchTerm: string;
    tags: string[];
    dateRange: 'all' | 'today' | 'week' | 'month';
    sortBy: 'date' | 'title' | 'tags';
    sortOrder: 'asc' | 'desc';
  };
  fetchLinks: () => Promise<void>;
  addLink: (url: string, tags: string[]) => Promise<void>;
  deleteLink: (id: number) => Promise<void>;
  setFilters: (filters: Partial<LinkStore['filters']>) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  getFilteredLinks: () => Link[];
  updateLinkTags: (linkId: number, tags: string[]) => Promise<void>;
}

export const useLinkStore = create<LinkStore>((set, get) => ({
  links: [],
  isLoading: false,
  error: null,
  viewMode: 'grid',
  filters: {
    searchTerm: '',
    tags: [],
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'asc'
  },

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ links: data || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al cargar los enlaces' });
    } finally {
      set({ isLoading: false });
    }
  },

  addLink: async (url: string, tags: string[]) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      if (typeof url !== 'string') {
        throw new Error('URL debe ser un string');
      }

      const metadata = await getURLMetadata(url.trim());

      const { data, error } = await supabase.from('links').insert([
        {
          url: url.trim(),
          tags: tags || [],
          user_id: userId,
          title: metadata.title,
          description: metadata.description,
          image: metadata.favicon,
          created_at: new Date().toISOString()
        },
      ]).select();

      if (error) throw error;

      set(state => ({
        links: [data[0], ...state.links]
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al agregar el enlace' });
    }
  },

  deleteLink: async (id: number) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      set(state => ({
        links: state.links.filter(link => link.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al eliminar el enlace' });
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  getFilteredLinks: () => {
    const state = get();
    let filtered = [...state.links];

    // Filtrar por término de búsqueda
    if (state.filters.searchTerm) {
      const searchTerm = state.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(link => 
        link.title.toLowerCase().includes(searchTerm) ||
        link.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filtrar por tags
    if (state.filters.tags.length > 0) {
      filtered = filtered.filter(link =>
        state.filters.tags.every(tag => link.tags?.includes(tag))
      );
    }

    // Filtrar por rango de fecha
    const now = new Date();
    switch (state.filters.dateRange) {
      case 'today':
        filtered = filtered.filter(link => {
          const date = new Date(link.created_at);
          return date.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        filtered = filtered.filter(link => new Date(link.created_at) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        filtered = filtered.filter(link => new Date(link.created_at) >= monthAgo);
        break;
    }

    // Ordenar
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (state.filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'tags':
          comparison = (a.tags?.length || 0) - (b.tags?.length || 0);
          break;
        default: // 'date'
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return state.filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },

  updateLinkTags: async (linkId: number, tags: string[]) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      if (!userId) {
        throw new Error('Usuario no autenticado');
      }

      const { error } = await supabase
        .from('links')
        .update({ tags })
        .eq('id', linkId)
        .eq('user_id', userId);

      if (error) throw error;

      set(state => ({
        links: state.links.map(link => 
          link.id === linkId ? { ...link, tags } : link
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error al actualizar etiquetas' });
    }
  }
}));