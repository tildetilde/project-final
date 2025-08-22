import { useState, useEffect } from 'react';
import { config } from '../config/environment';
import { Item } from '../types/admin';

export const useItems = (token: string | null) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setItems(data.data.items);
        } else {
          setError(data.error?.message || 'Failed to fetch items');
        }
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to fetch items');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Partial<Item>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/items`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to create item');
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id: string, itemData: Partial<Item>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to update item');
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!token) return false;
    
    if (!confirm('Are you sure you want to delete this item?')) return false;

    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchItems();
        return true;
      } else {
        const data = await response.json();
        setError(data.error?.message || data.message || 'Failed to delete item');
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
      fetchItems();
    }
  }, [token]);

  return {
    items,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    clearError
  };
};
