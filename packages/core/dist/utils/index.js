// Common utility functions
export const formatError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
};
export const createPaginationResponse = (data, total, page, limit) => {
    return {
        success: true,
        data,
        total,
        page,
        limit,
    };
};
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
//# sourceMappingURL=index.js.map