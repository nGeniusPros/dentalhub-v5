// API Endpoints
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
    },
    PATIENTS: '/patients',
    APPOINTMENTS: '/appointments',
    STAFF: '/staff',
    COMMUNICATIONS: '/communications',
};
// Error Messages
export const ERROR_MESSAGES = {
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
};
// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
};
// Pagination Defaults
export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};
//# sourceMappingURL=index.js.map