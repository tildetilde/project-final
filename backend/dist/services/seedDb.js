// /backend/src/services/seedDb.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';
dotenv.config();
// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Helper function to read and parse a JSON file
const readJsonFile = (filePath) => {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    catch (error) {
        console.error(`Error reading or parsing file: ${filePath}`, error);
        return null;
    }
};
const seedData = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in .env file');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data to prevent duplicates on re-seed
        await Item.deleteMany({});
        await Category.deleteMany({});
        console.log('Existing data cleared.');
        // Step 1: Read and seed Category data from JSON files
        const categoriesPath = path.join(__dirname, '../../data/categories');
        const categoryFiles = fs.readdirSync(categoriesPath).filter(file => file.endsWith('.json'));
        for (const file of categoryFiles) {
            const categoryData = readJsonFile(path.join(categoriesPath, file));
            if (categoryData) {
                await Category.create(categoryData);
                console.log(`Category "${categoryData.name}" seeded.`);
            }
        }
        // Step 2: Read and seed Item data from JSON files
        const itemsPath = path.join(__dirname, '../../data/items');
        const itemFiles = fs.readdirSync(itemsPath).filter(file => file.endsWith('.json'));
        for (const file of itemFiles) {
            const itemsData = readJsonFile(path.join(itemsPath, file));
            if (itemsData && Array.isArray(itemsData)) {
                await Item.insertMany(itemsData);
                console.log(`Items from file "${file}" seeded.`);
            }
        }
        console.log('Database seeding complete! 🌱');
        mongoose.connection.close();
    }
    catch (error) {
        console.error('Database seeding failed:', error);
        mongoose.connection.close();
    }
};
seedData();
//# sourceMappingURL=seedDb.js.map