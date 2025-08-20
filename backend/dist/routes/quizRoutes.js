import { Router } from 'express';
import { getCategories, getQuizItems, checkAnswers } from '../controllers/quizController.js';
import { validateCategoryId, validateQuizAnswers } from '../middleware/validation.js';
const router = Router();
router.get('/categories', getCategories);
router.get('/items/:categoryId', validateCategoryId, getQuizItems);
router.post('/check', validateQuizAnswers, checkAnswers);
export default router;
//# sourceMappingURL=quizRoutes.js.map