// Type guard for user metadata
export function isUserMetadata(metadata) {
    if (!metadata || typeof metadata !== "object") {
        return false;
    }
    const { role, practice_id, phone } = metadata;
    // Check role
    if (role !== undefined && typeof role !== "string") {
        return false;
    }
    // Check practice_id
    if (practice_id !== undefined && typeof practice_id !== "string") {
        return false;
    }
    // Check phone
    if (phone !== undefined && typeof phone !== "string") {
        return false;
    }
    return true;
}
//# sourceMappingURL=auth.js.map