import { ResponseBuilder } from '../utils/response.js';
export const validateCategoryId = (req, res, next) => {
    const { categoryId } = req.params;
    if (!categoryId || typeof categoryId !== 'string') {
        const response = ResponseBuilder.validationError('Valid categoryId is required', {
            received: categoryId,
            type: typeof categoryId,
        }, req);
        res.status(400).json(response);
        return;
    }
    next();
};
export const validateQuizAnswers = (req, res, next) => {
    const { userAnswers } = req.body;
    if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
        const response = ResponseBuilder.validationError('userAnswers must be a non-empty array', {
            received: userAnswers,
            type: typeof userAnswers,
            length: Array.isArray(userAnswers) ? userAnswers.length : 'not an array',
        }, req);
        res.status(400).json(response);
        return;
    }
    if (!userAnswers.every((id) => typeof id === 'string')) {
        const response = ResponseBuilder.validationError('All userAnswers must be strings', {
            received: userAnswers,
            invalidTypes: userAnswers.map((id, index) => ({ index, type: typeof id, value: id })),
        }, req);
        res.status(400).json(response);
        return;
    }
    next();
};
