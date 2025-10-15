import { useApi } from './useApi';
import { Item } from '../types/admin';

export const useItems = (token: string | null) => {
  const api = useApi<Item>('items', token, 'Are you sure you want to delete this item?');
  
  return {
    items: api.data,
    loading: api.loading,
    error: api.error,
    createItem: api.create,
    updateItem: api.update,
    deleteItem: api.delete,
    clearError: api.clearError
  };
};
