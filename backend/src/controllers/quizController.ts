import { Request, Response } from 'express';
import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';
import { QuizCheckResult, QuizItemsResponse } from '../types/quiz.js';
import { ResponseBuilder } from '../utils/response.js';
import { logger } from '../utils/logger.js';

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Get all quiz categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    const response = ResponseBuilder.success(categories, req);
    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching categories', 'QuizController', error as Error);
    const response = ResponseBuilder.error('Error fetching categories', 'FETCH_ERROR', {
      details: errorMessage
    }, req);
    res.status(500).json(response);
  }
};

// Get all items for a category (with values for game use)
export const getCategoryItems = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const items = await Item.find({ categoryId }).sort({ value: 1 });
    
    if (items.length === 0) {
      const response = ResponseBuilder.notFound('No items found for this category', req);
      return res.status(404).json(response);
    }

    const response = ResponseBuilder.success(items, req);
    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching category items', 'QuizController', error as Error);
    const response = ResponseBuilder.error('Error fetching category items', 'FETCH_ERROR', {
      details: errorMessage
    }, req);
    res.status(500).json(response);
  }
};

// Get a random set of quiz items for a category
export const getQuizItems = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    // Fetch both the category and items
    const [category, items] = await Promise.all([
      Category.findOne({ id: categoryId }),
      Item.find({ categoryId })
    ]);

    if (!category) {
      const response = ResponseBuilder.notFound('Category not found', req);
      return res.status(404).json(response);
    }

    if (items.length < 5) {
      const response = ResponseBuilder.error('Not enough items for this quiz', 'INSUFFICIENT_ITEMS', {
        required: 5,
        available: items.length,
      }, req);
      return res.status(404).json(response);
    }
    
    const shuffledItems = shuffleArray(items);
    const quizItems = shuffledItems.slice(0, 5); // Take 5 random items

    // Remove the 'value' before sending to the client
    const sanitizedItems = quizItems.map(item => ({
      _id: item._id?.toString() || '',
      id: item.id,
      name: item.name,
      label: item.label
    }));
    
    const responseData: QuizItemsResponse = {
        unit: category.unit,
        items: sanitizedItems,
        question: category.get('question') || '',
        unitVisible: category.get('unitVisible') || false,
    };
    
    const response = ResponseBuilder.success(responseData, req);
    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error fetching quiz items', 'QuizController', error as Error);
    const response = ResponseBuilder.error('Error fetching quiz items', 'FETCH_ERROR', {
      details: errorMessage
    }, req);
    res.status(500).json(response);
  }
};

// Check if the user's answers are correct
export const checkAnswers = async (req: Request, res: Response) => {
  const { userAnswers } = req.body; // userAnswers is an array of item IDs

  try {
    const itemIds = userAnswers.map((id: string) => id);
    const correctItems = await Item.find({ '_id': { $in: itemIds } }).sort({ 'value': 1 }).lean();
    
    // Check if the user's order matches the sorted order of correct answers
    const isCorrect = userAnswers.every((id: string, index: number) => {
      const correctItem = correctItems[index];
      return correctItem && id === correctItem._id.toString();
    });

    const result: QuizCheckResult = { isCorrect };
    
    const response = ResponseBuilder.success(result, req);
    res.status(200).json(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Error checking answers', 'QuizController', error as Error);
    const response = ResponseBuilder.error('Error checking answers', 'CHECK_ERROR', {
      details: errorMessage
    }, req);
    res.status(500).json(response);
  }
};