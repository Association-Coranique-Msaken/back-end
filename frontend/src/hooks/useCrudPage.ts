import { useState, useEffect, useCallback } from 'react';

export interface CrudOperations<T> {
  getAll: (params?: any) => Promise<{ data: T[] }>;
  create?: (data: any) => Promise<T>;
  update?: (id: string, data: any) => Promise<T>;
  delete?: (id: string) => Promise<void>;
}

export function useCrudPage<T extends { id: string }>(operations: CrudOperations<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await operations.getAll({ page: 1, take: 100 });
      if (response.data) {
        setItems(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setError('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  }, [operations]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleCreate = useCallback(() => {
    setSelectedItem(null);
    setOpenDialog(true);
  }, []);

  const handleEdit = useCallback((item: T) => {
    setSelectedItem(item);
    setOpenDialog(true);
  }, []);

  const handleDelete = useCallback(async (itemId: string) => {
    if (!operations.delete) return;
    
    try {
      await operations.delete(itemId);
      await fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('فشل حذف العنصر');
    }
  }, [operations, fetchItems]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setSelectedItem(null);
  }, []);

  const handleSuccess = useCallback(() => {
    fetchItems();
    handleCloseDialog();
  }, [fetchItems, handleCloseDialog]);

  return {
    items,
    loading,
    openDialog,
    selectedItem,
    error,
    handleCreate,
    handleEdit,
    handleDelete,
    handleCloseDialog,
    handleSuccess,
    refreshItems: fetchItems,
  };
}
