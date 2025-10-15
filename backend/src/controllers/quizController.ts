import { Request, Response } from 'express';
import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';


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