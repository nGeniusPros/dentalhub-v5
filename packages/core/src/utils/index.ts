// Common utility functions

export const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  return {
    success: true,
    data,
    total,
    page,
    limit,
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
