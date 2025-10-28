import { config } from '../config/environment';
import type { GameItem, GameCategory } from '../types/game';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.backendUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}/api/quiz${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getCategories(): Promise<GameCategory[]> {
    const categories = await this.request<any[]>('/categories');
    return categories.map(cat => ({
      _id: cat._id,
      id: cat.id,
      name: cat.name,
      description: cat.description,
      question: cat.question || cat.description || `Which ${cat.name} is the most?`,
      unit: cat.unit,
      unitVisible: cat.unitVisible ?? true,
      sort: cat.sort,
      source: cat.source,
      version: cat.version,
    }));
  }

  async getItems(categoryId: string, withValues = false): Promise<GameItem[]> {
    const endpoint = withValues ? `/category/${categoryId}/items` : `/items/${categoryId}`;
    const response = await this.request<any>(endpoint);
    const items = response.items || response;
    
    return items.map((item: any) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      label: item.label,
      value: withValues ? item.value : 0,
      categoryId: categoryId,
      source: response.source || item.source,
    }));
  }
}

export const apiService = new ApiService();
