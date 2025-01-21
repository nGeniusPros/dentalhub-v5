export declare const API_ROUTES: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly LOGOUT: "/auth/logout";
        readonly REFRESH: "/auth/refresh";
    };
    readonly PATIENTS: "/patients";
    readonly APPOINTMENTS: "/appointments";
    readonly STAFF: "/staff";
    readonly COMMUNICATIONS: "/communications";
};
export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Unauthorized access";
    readonly INVALID_CREDENTIALS: "Invalid credentials";
    readonly SERVER_ERROR: "Internal server error";
    readonly NOT_FOUND: "Resource not found";
    readonly VALIDATION_ERROR: "Validation error";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly INTERNAL_SERVER_ERROR: 500;
};
export declare const PAGINATION: {
    readonly DEFAULT_PAGE: 1;
    readonly DEFAULT_LIMIT: 10;
    readonly MAX_LIMIT: 100;
};
