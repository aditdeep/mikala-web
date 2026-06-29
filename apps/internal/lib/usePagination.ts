import { useState, useEffect, useMemo } from 'react';

export function usePagination<T>(items: T[], perPage = 20, deps: any[] = []) {
  const [page, setPage] = useState(1);
  useEffect(() => { setPage(1); /* eslint-disable-next-line */ }, deps);
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const paged = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage]
  );
  return { page, setPage, perPage, totalPages, paged, total: items.length };
}
