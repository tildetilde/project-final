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

export interface QuizItemsResponse {
  question: string;
  unit: string;
  unitVisible: boolean;
  items: Omit<QuizItem, 'value' | 'categoryId' | 'source'>[];
}

export interface QuizAnswer {
  userAnswers: string[];
}

export interface QuizResponse {
  success: boolean;
  data?: QuizItemsResponse | QuizCheckResult;
  error?: {
    message: string;
    stack?: string;
  };
}

export interface QuizCheckResult {
  isCorrect: boolean;
  correctOrder?: QuizItem[];
  userOrder?: QuizItem[];
}
