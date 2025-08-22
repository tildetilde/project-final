import { useState, useEffect } from 'react';
import { config } from '../config/environment';
import { Category } from '../types/admin';

export const useCategories = (token: string | null) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data.categories);
        } else {
          setError(data.error?.message || 'Failed to fetch categories');
        }
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to fetch categories');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: Partial<Category>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        await fetchCategories();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to create category');
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Category>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });

      if (response.ok) {
        await fetchCategories();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to update category');
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!token) return false;
    
    if (!confirm('Are you sure you want to delete this category?')) return false;

    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchCategories();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to delete category');
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  useEffect(() => {
    if (token) {
      fetchCategories();
    }
  }, [token]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError
  };
};
