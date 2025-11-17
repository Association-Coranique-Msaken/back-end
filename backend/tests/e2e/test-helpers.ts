// E2E Test Helper Utilities

let testCounter = 0;

/**
 * Generates a unique identifier for testing purposes.
 * Uses a combination of timestamp and incrementing counter to avoid collisions
 * even when tests run in quick succession or in parallel.
 *
 * @returns A 3-digit unique identifier string
 */
export function generateUniqueId(): string {
    testCounter++;
    const timestamp = Date.now();
    const combined = (timestamp + testCounter) % 1000;
    return combined.toString().padStart(3, "0");
}

/**
 * Generates a unique user identifier in the format 20XXXXX
 * @returns A 7-digit identifier starting with "2025"
 */
export function generateUserIdentifier(): string {
    return `2025${generateUniqueId()}`;
}

/**
 * Generates a unique group code (2-3 digits)
 * @returns A 2-digit code string
 */
export function generateGroupCode(): string {
    const id = generateUniqueId();
    return id.slice(-2);
}

/**
 * Reset the counter (useful for test isolation)
 */
export function resetCounter(): void {
    testCounter = 0;
}
