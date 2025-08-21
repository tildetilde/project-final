import { Item } from '../models/Item.js';
import { Category } from '../models/Category.js';
// Helper function to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
// Get all quiz categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            data: categories
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error fetching categories', details: errorMessage }
        });
    }
};
// Get all items for a category (with values for game use)
export const getCategoryItems = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const items = await Item.find({ categoryId }).sort({ value: 1 });
        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                error: { message: 'No items found for this category.' }
            });
        }
        res.status(200).json({
            success: true,
            data: items
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error fetching category items', details: errorMessage }
        });
    }
};
// Get a random set of quiz items for a category
export const getQuizItems = async (req, res) => {
    const { categoryId } = req.params;
    try {
        // Fetch both the category and items
        const [category, items] = await Promise.all([
            Category.findOne({ id: categoryId }),
            Item.find({ categoryId })
        ]);
        if (!category) {
            return res.status(404).json({
                success: false,
                error: { message: 'Category not found.' }
            });
        }
        if (items.length < 5) {
            return res.status(404).json({
                success: false,
                error: { message: 'Not enough items for this quiz.' }
            });
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
        const responseData = {
            unit: category.unit,
            items: sanitizedItems,
            question: category.get('question') || '',
            unitVisible: category.get('unitVisible') || false,
        };
        res.status(200).json({
            success: true,
            data: responseData
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error fetching quiz items', details: errorMessage }
        });
    }
};
// Check if the user's answers are correct
export const checkAnswers = async (req, res) => {
    const { userAnswers } = req.body; // userAnswers is an array of item IDs
    try {
        const itemIds = userAnswers.map((id) => id);
        const correctItems = await Item.find({ '_id': { $in: itemIds } }).sort({ 'value': 1 }).lean();
        // Check if the user's order matches the sorted order of correct answers
        const isCorrect = userAnswers.every((id, index) => {
            const correctItem = correctItems[index];
            return correctItem && id === correctItem._id.toString();
        });
        const result = { isCorrect };
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: { message: 'Error checking answers', details: errorMessage }
        });
    }
};
//# sourceMappingURL=quizController.js.map