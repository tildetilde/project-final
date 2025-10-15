import { Request, Response } from 'express';
import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';

// Helper function to shuffle an array
const shuffleArray = <T>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('[QuizController] Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Error fetching categories' });
  }
};

export const getCategoryItems = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const items = await Item.find({ categoryId });
    
    if (items.length === 0) {
      return res.status(404).json({ success: false, error: 'No items found for this category' });
    }

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error('[QuizController] Error fetching category items:', error);
    res.status(500).json({ success: false, error: 'Error fetching category items' });
  }
};

export const getQuizItems = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    
    // Find the category
    const category = await Category.findOne({ id: categoryId });
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    // Get items for this category
    const items = await Item.find({ categoryId });
    if (items.length < 2) {
      return res.status(400).json({ 
        success: false, 
        error: 'Not enough items for this quiz' 
      });
    }

    // Shuffle and take first 10 items
    const shuffledItems = shuffleArray(items).slice(0, 10);
    
    const responseData = {
      question: category.question || `Which ${category.name} is the most?`,
      unit: category.unit,
      unitVisible: category.unitVisible || false,
      items: shuffledItems.map(item => ({
        _id: item._id,
        id: item.id,
        name: item.name,
        label: item.label
      }))
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    console.error('[QuizController] Error fetching quiz items:', error);
    res.status(500).json({ success: false, error: 'Error fetching quiz items' });
  }
};

export const checkAnswers = async (req: Request, res: Response) => {
  try {
    const { categoryId, userAnswers } = req.body;

    if (!categoryId || !Array.isArray(userAnswers) || userAnswers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid categoryId and userAnswers array are required' 
      });
    }

    // Get the correct order from the database
    const items = await Item.find({ categoryId }).sort({ value: 1 });
    
    if (items.length !== userAnswers.length) {
      return res.status(400).json({ 
        success: false, 
        error: 'Number of answers does not match number of items' 
      });
    }

    // Check answers
    let correctCount = 0;
    const results = userAnswers.map((userAnswer: string, index: number) => {
      const isCorrect = userAnswer === items[index].id;
      if (isCorrect) correctCount++;
      return {
        userAnswer,
        correctAnswer: items[index].id,
        isCorrect,
        item: {
          id: items[index].id,
          name: items[index].name,
          label: items[index].label,
          value: items[index].value
        }
      };
    });

    const result = {
      isCorrect: correctCount === userAnswers.length,
      correctOrder: items,
      userOrder: results.map(r => r.item)
    };

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[QuizController] Error checking answers:', error);
    res.status(500).json({ success: false, error: 'Error checking answers' });
  }
};