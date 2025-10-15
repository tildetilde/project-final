import { useApi } from './useApi';
import { Category } from '../types/admin';

export const useCategories = (token: string | null) => {
  const api = useApi<Category>('categories', token, 'Are you sure you want to delete this category?');
  
  return {
    categories: api.data,
    loading: api.loading,
    error: api.error,
    createCategory: api.create,
    updateCategory: api.update,
    deleteCategory: api.delete,
    clearError: api.clearError
  };
};
