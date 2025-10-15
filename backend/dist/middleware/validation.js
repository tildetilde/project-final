export const validateCategoryId = (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId || typeof categoryId !== 'string') {
        res.status(400).json({ success: false, error: 'Valid categoryId is required' });
        return;
    }
    next();
};
export const validateQuizAnswers = (req, res, next) => {
    const { userAnswers } = req.body;
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        res.status(400).json({ success: false, error: 'userAnswers must be a non-empty array' });
        return;
    }
    if (!userAnswers.every((id) => typeof id === 'string')) {
        res.status(400).json({ success: false, error: 'All userAnswers must be strings' });
        return;
    }
    next();
};
