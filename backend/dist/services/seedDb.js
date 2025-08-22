// /backend/src/services/seedDb.ts
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';
import { config } from '../config/environment.js';
import { logger } from '../utils/logger.js';
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
        logger.error(`Error reading or parsing file: ${filePath}`, 'SeedDB', error);
        return null;
    }
};
const seedData = async () => {
    try {
        await mongoose.connect(config.MONGODB_URI);
        logger.info('Connected to MongoDB', 'SeedDB');
        // Clear existing data to prevent duplicates on re-seed
        await Item.deleteMany({});
        await Category.deleteMany({});
        logger.info('Existing data cleared', 'SeedDB');
        // Step 1: Read and seed Category data from JSON files
        const categoriesPath = path.join(__dirname, '../../data/categories');
        const categoryFiles = fs.readdirSync(categoriesPath).filter(file => file.endsWith('.json'));
        for (const file of categoryFiles) {
            const categoryData = readJsonFile(path.join(categoriesPath, file));
            if (categoryData) {
                await mongoose.connection.collection('categories').insertOne(categoryData);
                logger.info(`Category "${categoryData.name}" seeded`, 'SeedDB');
            }
        }
        // Step 2: Read and seed Item data from JSON files
        const itemsPath = path.join(__dirname, '../../data/items');
        const itemFiles = fs.readdirSync(itemsPath).filter(file => file.endsWith('.json'));
        for (const file of itemFiles) {
            const itemsData = readJsonFile(path.join(itemsPath, file));
            if (itemsData && Array.isArray(itemsData)) {
                await Item.insertMany(itemsData);
                logger.info(`Items from file "${file}" seeded`, 'SeedDB');
            }
        }
        logger.info('Database seeding complete!', 'SeedDB');
        mongoose.connection.close();
    }
    catch (error) {
        logger.error('Database seeding failed', 'SeedDB', error);
        mongoose.connection.close();
    }
};
seedData();
//# sourceMappingURL=seedDb.js.map