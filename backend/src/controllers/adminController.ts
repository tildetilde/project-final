import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Category } from '../models/Category.js';
import { Item } from '../models/Item.js';
import { config } from '../config/environment.js';

// Admin Authentication
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    const admin = await Admin.findOne({ username, isActive: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign({ adminId: admin._id }, config.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      success: true,
      data: {
        message: 'Login successful',
        admin: { id: admin._id, username: admin.username, email: admin.email, lastLogin: admin.lastLogin },
        token
      }
    });
  } catch (error) {
    console.error('[AdminController] Admin login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const adminLogout = (req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Logout successful' } });
};

export const getAdminProfile = (req: Request, res: Response) => {
  const admin = req.admin;
  if (!admin) {
    return res.status(401).json({ success: false, error: 'Admin not found' });
  }
  
  res.json({
    success: true,
    data: {
      admin: { id: admin._id, username: admin.username, email: admin.email, lastLogin: admin.lastLogin }
    }
  });
};

// Category Management
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, data: { categories } });
  } catch (error) {
    console.error('[AdminController] Get categories error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    if (await Category.findOne({ id: categoryData.id })) {
      return res.status(409).json({ success: false, error: 'Category with this ID already exists' });
    }

    const category = new Category(categoryData);
    await category.save();
    
    res.status(201).json({ 
      success: true,
      data: { 
        message: 'Category created successfully',
        category 
      }
    });
  } catch (error) {
    console.error('[AdminController] Create category error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ 
      success: true,
      data: { 
        message: 'Category updated successfully',
        category 
      }
    });
  } catch (error) {
    console.error('[AdminController] Update category error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!(await Category.findOne({ id }))) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    if (await Item.countDocuments({ categoryId: id }) > 0) {
      return res.status(409).json({ success: false, error: 'Cannot delete category with existing items' });
    }
    
    await Category.deleteOne({ id });
    res.json({ success: true, data: { message: 'Category deleted successfully' } });
  } catch (error) {
    console.error('[AdminController] Delete category error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Item Management
export const getAllItems = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { categoryId } : {};
    const items = await Item.find(query).sort({ name: 1 });
    res.json({ success: true, data: { items } });
  } catch (error) {
    console.error('[AdminController] Get items error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const createItem = async (req: Request, res: Response) => {
  try {
    const itemData = req.body;
    
    if (await Item.findOne({ id: itemData.id })) {
      return res.status(409).json({ success: false, error: 'Item with this ID already exists' });
    }
    
    if (!(await Category.findOne({ id: itemData.categoryId }))) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const item = new Item(itemData);
    await item.save();
    
    res.status(201).json({ 
      success: true,
      data: { 
        message: 'Item created successfully',
        item 
      }
    });
  } catch (error) {
    console.error('[AdminController] Create item error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    if (updateData.categoryId && !(await Category.findOne({ id: updateData.categoryId }))) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    const item = await Item.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    res.json({ 
      success: true,
      data: { 
        message: 'Item updated successfully',
        item 
      }
    });
  } catch (error) {
    console.error('[AdminController] Update item error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const deleteItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Item.findOneAndDelete({ id });
    
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    res.json({ success: true, data: { message: 'Item deleted successfully' } });
  } catch (error) {
    console.error('[AdminController] Delete item error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};