export const validateCategoryId = (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId || typeof categoryId !== 'string') {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Valid categoryId is required'
            }
        });
    }
    next();
};
export const validateQuizAnswers = (req, res, next) => {
    const { userAnswers } = req.body;
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'userAnswers must be a non-empty array'
            }
        });
    }
    if (!userAnswers.every(id => typeof id === 'string')) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'All userAnswers must be strings'
            }
        });
    }
    next();
};
//# sourceMappingURL=validation.js.map