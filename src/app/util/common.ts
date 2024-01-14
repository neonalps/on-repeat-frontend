const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const charactersLength = characters.length;

export const API_QUERY_PARAM_NEXT_PAGE_KEY = "nextPageKey";

export function generateRandomString(size: number): string {
    const result = [];
    for (let i = 0; i < size; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join("");
}

export function isDefined(toCheck: unknown): boolean {
    return toCheck !== null && toCheck !== undefined;
}

export function isNotDefined(toCheck: unknown): boolean {
    return !isDefined(toCheck);
}

export function hasText(toCheck: string | null | undefined): boolean {
    return isDefined(toCheck) && (toCheck as string).trim().length > 0;
}