import express from 'express';
import { adminLogin, adminLogout, getAdminProfile, getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getAllItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
const router = express.Router();
// Public routes (no authentication required)
router.post('/login', adminLogin);
// Protected routes (authentication required)
router.use(authenticateToken);
// Admin profile
router.get('/profile', getAdminProfile);
router.post('/logout', adminLogout);
// Category management
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
// Item management
router.get('/items', getAllItems);
router.get('/items/:id', getItemById);
router.post('/items', createItem);
router.put('/items/:id', updateItem);
router.delete('/items/:id', deleteItem);
export default router;
