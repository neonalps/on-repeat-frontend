import { isDefined } from "@src/app/util/common";

export function validateDefined(input: unknown, property: string): void {
    if (!isDefined(input)) {
        throw new Error(`${property} must not be null or undefined`);
    }
};

export function validateNotEmpty(input: Set<unknown>, property: string): void {
    if (!input || input.size === 0) {
        throw new Error(`${property} must not be empty`);
    }
};

export function validateNotBlank(input: string, property: string): void {
    if (!input || input.trim().length <= 0) {
        throw new Error(`${property} must not be blank`);
    }
};