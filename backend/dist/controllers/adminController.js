import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { config } from '../config/environment.js';
import { ResponseBuilder } from '../utils/response.js';
import { logger } from '../utils/logger.js';
// Admin Authentication
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            const response = ResponseBuilder.validationError('Username and password are required', {
                received: { username: !!username, password: !!password },
            }, req);
            return res.status(400).json(response);
        }
        // Find admin by username
        const admin = await Admin.findOne({ username, isActive: true });
        if (!admin) {
            const response = ResponseBuilder.unauthorized('Invalid credentials', req);
            return res.status(401).json(response);
        }
        // Check password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            const response = ResponseBuilder.unauthorized('Invalid credentials', req);
            return res.status(401).json(response);
        }
        // Update last login
        admin.lastLogin = new Date();
        await admin.save();
        // Generate JWT token
        const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET, { expiresIn: '24h' });
        // Return admin info (without password) and token
        const adminInfo = {
            id: admin._id,
            username: admin.username,
            email: admin.email,
            lastLogin: admin.lastLogin
        };
        const response = ResponseBuilder.success({
            message: 'Login successful',
            admin: adminInfo,
            token
        }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Admin login error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const adminLogout = async (req, res) => {
    try {
        // In a real app, you might want to blacklist the token
        // For now, we'll just return success
        const response = ResponseBuilder.success({ message: 'Logout successful' }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Admin logout error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const getAdminProfile = async (req, res) => {
    try {
        const admin = req.admin;
        if (!admin) {
            const response = ResponseBuilder.unauthorized('Admin not found', req);
            return res.status(401).json(response);
        }
        const response = ResponseBuilder.success({
            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email,
                lastLogin: admin.lastLogin
            }
        }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Get admin profile error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
// Category Management
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        const response = ResponseBuilder.success({ categories }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Get categories error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findOne({ id });
        if (!category) {
            const response = ResponseBuilder.notFound('Category not found', req);
            return res.status(404).json(response);
        }
        const response = ResponseBuilder.success({ category }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Get category error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const createCategory = async (req, res) => {
    try {
        const categoryData = req.body;
        // Check if category with same ID already exists
        const existingCategory = await Category.findOne({ id: categoryData.id });
        if (existingCategory) {
            const response = ResponseBuilder.error('Category with this ID already exists', 'CONFLICT', {
                existingId: categoryData.id,
            }, req);
            return res.status(409).json(response);
        }
        const category = new Category(categoryData);
        await category.save();
        const response = ResponseBuilder.success({
            message: 'Category created successfully',
            category
        }, req);
        res.status(201).json(response);
    }
    catch (error) {
        logger.error('Create category error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const category = await Category.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
        if (!category) {
            const response = ResponseBuilder.notFound('Category not found', req);
            return res.status(404).json(response);
        }
        const response = ResponseBuilder.success({
            message: 'Category updated successfully',
            category
        }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Update category error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if category exists
        const category = await Category.findOne({ id });
        if (!category) {
            const response = ResponseBuilder.notFound('Category not found', req);
            return res.status(404).json(response);
        }
        // Check if there are items in this category
        const itemCount = await Item.countDocuments({ categoryId: id });
        if (itemCount > 0) {
            const response = ResponseBuilder.error('Cannot delete category with existing items', 'CONFLICT', {
                itemCount
            }, req);
            return res.status(409).json(response);
        }
        await Category.deleteOne({ id });
        const response = ResponseBuilder.success({ message: 'Category deleted successfully' }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Delete category error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
// Item Management
export const getAllItems = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let query = {};
        if (categoryId) {
            query = { categoryId };
        }
        const items = await Item.find(query).sort({ name: 1 });
        const response = ResponseBuilder.success({ items }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Get items error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findOne({ id });
        if (!item) {
            const response = ResponseBuilder.notFound('Item not found', req);
            return res.status(404).json(response);
        }
        const response = ResponseBuilder.success({ item }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Get item error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const createItem = async (req, res) => {
    try {
        const itemData = req.body;
        // Check if item with same ID already exists
        const existingItem = await Item.findOne({ id: itemData.id });
        if (existingItem) {
            const response = ResponseBuilder.error('Item with this ID already exists', 'CONFLICT', {
                existingId: itemData.id,
            }, req);
            return res.status(409).json(response);
        }
        // Verify category exists
        const category = await Category.findOne({ id: itemData.categoryId });
        if (!category) {
            const response = ResponseBuilder.notFound('Category not found', req);
            return res.status(404).json(response);
        }
        const item = new Item(itemData);
        await item.save();
        const response = ResponseBuilder.success({
            message: 'Item created successfully',
            item
        }, req);
        res.status(201).json(response);
    }
    catch (error) {
        logger.error('Create item error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // If categoryId is being updated, verify the new category exists
        if (updateData.categoryId) {
            const category = await Category.findOne({ id: updateData.categoryId });
            if (!category) {
                const response = ResponseBuilder.notFound('Category not found', req);
                return res.status(404).json(response);
            }
        }
        const item = await Item.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
        if (!item) {
            const response = ResponseBuilder.notFound('Item not found', req);
            return res.status(404).json(response);
        }
        const response = ResponseBuilder.success({
            message: 'Item updated successfully',
            item
        }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Update item error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
export const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Item.findOneAndDelete({ id });
        if (!item) {
            const response = ResponseBuilder.notFound('Item not found', req);
            return res.status(404).json(response);
        }
        const response = ResponseBuilder.success({ message: 'Item deleted successfully' }, req);
        res.json(response);
    }
    catch (error) {
        logger.error('Delete item error', 'AdminController', error);
        const response = ResponseBuilder.internalError('Internal server error', req);
        res.status(500).json(response);
    }
};
