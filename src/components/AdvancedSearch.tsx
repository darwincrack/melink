import React from 'react';
import { Filter, List, Grid } from 'lucide-react';
import { useLinkStore } from '../store/useLinkStore';

interface FilterOptions {
  searchTerm: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  sortBy: 'date' | 'title' | 'tags';
  sortOrder: 'asc' | 'desc';
}

export function AdvancedSearch() {
  const { setFilters, allTags, viewMode, setViewMode } = useLinkStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [filters, setLocalFilters] = React.useState<FilterOptions>({
    searchTerm: '',
    tags: [],
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleFilterChange = (changes: Partial<FilterOptions>) => {
    const newFilters = { ...filters, ...changes };
    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
            placeholder="Buscar enlaces..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700"
        >
          <Filter size={18} />
          Filtros
        </button>

        <div className="flex gap-2 border-l border-gray-700 pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="bg-gray-800 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Ordenar por</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
              >
                <option value="date">Fecha</option>
                <option value="title">Título</option>
                <option value="tags">Etiquetas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Orden</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange({ sortOrder: e.target.value as FilterOptions['sortOrder'] })}
                className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
              >
                <option value="desc">Descendente</option>
                <option value="asc">Ascendente</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Rango de fecha</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange({ dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600"
            >
              <option value="all">Todos</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter(t => t !== tag)
                      : [...filters.tags, tag];
                    handleFilterChange({ tags: newTags });
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filters.tags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 