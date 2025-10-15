export interface QuizItem {
  _id: string;
  id: string;
  name: string;
  value: number;
  label: string;
  categoryId: string;
  source: {
    name: string;
  };
}

export interface QuizCategory {
  _id: string;
  id: string;
  name: string;
  description?: string;
  question?: string;
  unit: string;
  unitVisible?: boolean;
  sort?: 'asc' | 'desc';
  source?: {
    name: string;
    url: string;
  };
  version?: number;
}