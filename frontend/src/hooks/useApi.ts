import { useState, useEffect } from 'react';
import { config } from '../config/environment';

interface ApiState<T> {
  data: T[];
  loading: boolean;
  error: string;
}

interface ApiActions<T> {
  fetch: () => Promise<void>;
  create: (item: Partial<T>) => Promise<boolean>;
  update: (id: string, item: Partial<T>) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export function useApi<T extends { id: string }>(
  endpoint: string,
  token: string | null,
  confirmMessage?: string
): ApiState<T> & ApiActions<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData(result.data[endpoint] || result.data);
        } else {
          setError(result.error?.message || `Failed to fetch ${endpoint}`);
        }
      } else {
        const result = await response.json();
        setError(result.error?.message || result.message || `Failed to fetch ${endpoint}`);
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const create = async (itemData: Partial<T>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchData();
        return true;
      } else {
        const result = await response.json();
        setError(result.error?.message || result.message || `Failed to create ${endpoint.slice(0, -1)}`);
        return false;
      }
    } catch (error) {
      setError('Network error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string, itemData: Partial<T>) => {
    if (!token) return false;
    
    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (response.ok) {
        await fetchData();
        return true;
      } else {
        const result = await response.json();
        setError(result.error?.message || result.message || `Failed to update ${endpoint.slice(0, -1)}`);
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
    
    if (confirmMessage && !confirm(confirmMessage)) return false;

    try {
      setLoading(true);
      const response = await fetch(`${config.backendUrl}/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchData();
        return true;
      } else {
        const result = await response.json();
        setError(result.error?.message || result.message || `Failed to delete ${endpoint.slice(0, -1)}`);
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
      fetchData();
    }
  }, [token]);

  return {
    data,
    loading,
    error,
    fetch: fetchData,
    create,
    update,
    delete: deleteItem,
    clearError
  };
}
