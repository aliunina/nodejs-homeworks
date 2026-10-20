export function getSanitizedPayload(payload, allowedFields) {
    return Object.fromEntries(
        Object.entries(payload).filter(
            ([key, value]) => allowedFields.includes(key) && value !== undefined
        )
    );
}
