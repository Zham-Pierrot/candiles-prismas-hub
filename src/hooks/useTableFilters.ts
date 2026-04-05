import { useState, useMemo, useEffect } from 'react';

export interface TableFiltersConfig<T> {
  data: T[];
  searchFields: (keyof T)[];
  dateField: keyof T;
  statusField: keyof T;
  clientField?: keyof T;
  defaultSort: { field: keyof T; direction: 'asc' | 'desc' };
}

export type DateFilterValue = 'all' | 'today' | 'week' | 'month' | '3months';

export function useTableFilters<T extends Record<string, any>>(config: TableFiltersConfig<T>) {
  const { data, searchFields, dateField, statusField, clientField, defaultSort } = config;

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterValue>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof T>(defaultSort.field);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSort.direction);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 20 | 50>(10);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, dateFilter, clientFilter, pageSize]);

  const toggleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        searchFields.some(f => String(item[f]).toLowerCase().includes(q))
      );
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter(item => item[statusField] === statusFilter);
    }

    // Client
    if (clientFilter !== 'all' && clientField) {
      result = result.filter(item => item[clientField] === clientFilter);
    }

    // Date
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter(item => {
        const d = new Date(item[dateField] as string);
        switch (dateFilter) {
          case 'today': return d >= today;
          case 'week': { const w = new Date(today); w.setDate(w.getDate() - 7); return d >= w; }
          case 'month': { const m = new Date(today); m.setMonth(m.getMonth() - 1); return d >= m; }
          case '3months': { const m3 = new Date(today); m3.setMonth(m3.getMonth() - 3); return d >= m3; }
          default: return true;
        }
      });
    }

    // Sort
    result.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      let cmp = 0;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [data, debouncedSearch, statusFilter, dateFilter, clientFilter, sortField, sortDirection, searchFields, statusField, clientField, dateField]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize]);

  const uniqueClients = useMemo(() => {
    if (!clientField) return [];
    const set = new Set(data.map(d => String(d[clientField])));
    return Array.from(set).sort();
  }, [data, clientField]);

  return {
    search, setSearch,
    statusFilter, setStatusFilter,
    dateFilter, setDateFilter,
    clientFilter, setClientFilter,
    sortField, sortDirection, toggleSort,
    page, setPage,
    pageSize, setPageSize,
    filteredData,
    paginatedData,
    totalPages,
    totalFiltered: filteredData.length,
    uniqueClients,
  };
}
