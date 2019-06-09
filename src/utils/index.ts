export function isJsonc(value: string): boolean {
    return /^\{[\W\w]*?\}$/.test(value.trim());
}