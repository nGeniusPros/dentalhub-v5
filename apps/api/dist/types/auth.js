export const validateUserMetadata = (metadata) => {
    return typeof metadata === 'object' && metadata !== null &&
        (!('role' in metadata) || typeof metadata.role === 'string') &&
        (!('practice_id' in metadata) || typeof metadata.practice_id === 'string') &&
        (!('phone' in metadata) || typeof metadata.phone === 'string');
};
