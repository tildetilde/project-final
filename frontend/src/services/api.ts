import { config } from '../config/environment';
import type { GameItem, GameCategory } from '../types/game';

// API service for communicating with the backend
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

  // Fetch all categories
  async getCategories(): Promise<GameCategory[]> {
    const categories = await this.request<any[]>('/categories');
    return categories.map(cat => ({
      _id: cat._id,
      id: cat.id,
      name: cat.name,
      question: cat.question || cat.description || `Which ${cat.name} is the most?`,
      unit: cat.unit,
      source: cat.source,
    }));
  }

  // Fetch items for a specific category (without values, for quiz mode)
  async getItemsByCategory(categoryId: string): Promise<GameItem[]> {
    const response = await this.request<any>('/items/' + categoryId);
    
    // Transform the backend response to match our GameItem type
    return response.items.map((item: any, index: number) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      label: item.label,
      value: 0, // We'll need to get the actual values from the backend
      categoryId: categoryId,
      source: response.source,
    }));
  }

  // Get items with their actual values (for game logic)
  async getItemsWithValues(categoryId: string): Promise<GameItem[]> {
    const items = await this.request<any[]>(`/category/${categoryId}/items`);
    
    // Transform the backend response to match our GameItem type
    return items.map((item: any) => ({
      _id: item._id,
      id: item.id,
      name: item.name,
      label: item.label,
      value: item.value, // Now we have the actual values!
      categoryId: categoryId,
      source: item.source,
    }));
  }
}

export const apiService = new ApiService();
