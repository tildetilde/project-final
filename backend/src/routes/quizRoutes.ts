import { Router } from 'express';
import { getCategories, getCategoryItems, checkAnswers } from '../controllers/quizController.js';
import { validateCategoryId, validateQuizAnswers } from '../middleware/validation.js';

const router = Router();

router.get('/categories', getCategories);
router.get('/category/:categoryId/items', validateCategoryId, getCategoryItems);
router.post('/check', validateQuizAnswers, checkAnswers);

export default router;