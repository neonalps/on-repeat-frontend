import { validateDefined } from "@src/app/util/validation";
import { isNotDefined } from "./common";
import { formatDate } from "@angular/common";

export function getDateWithoutTime(input: Date): Date {
    validateDefined(input, "input");

    return new Date(input.toDateString());
}

export function getDateFromUnixTimestamp(unix: number): Date {
    return new Date(unix * 1000);
}

export function getUnixTimestampFromDate(input: Date): number {
    return Math.floor(input.getTime() / 1000);
}

export function getGroupableDateString(input: Date): string {
    validateDefined(input, "input");

    const dateWithoutTime = getDateWithoutTime(input);

    const paddedMonth = `${(dateWithoutTime.getMonth() + 1).toString().padStart(2, '0')}`;
    const paddedDay = `${dateWithoutTime.getDate().toString().padStart(2, '0')}`;

    return `${dateWithoutTime.getFullYear()}-${paddedMonth}-${paddedDay}`;
}

export function getNow(): Date {
    return new Date();
}

export function getEarliestDateOfArray(dates: Date[]): Date | null {
    if (isNotDefined(dates) || dates.length === 0) {
        return null;
    }

    let currentEarliest: Date | null = null;
    for (const item of dates) {
        if (currentEarliest === null || item < currentEarliest) {
            currentEarliest = item;
        }
    }

    return currentEarliest;
}

export function getLatestDateOfArray(dates: Date[]): Date | null {
    if (isNotDefined(dates) || dates.length === 0) {
        return null;
    }

    let currentLatest: Date | null = null;
    for (const item of dates) {
        if (currentLatest === null || item > currentLatest) {
            currentLatest = item;
        }
    }
    
    return currentLatest;
}

export function getStartOfDayIsoString(date: string): string {
    return `${date}T00:00:00.000Z`;
}

export function getEndOfDayIsoString(date: string): string {
    return `${date}T23:59:59.999Z`;
}

export function formatJobDate(date: Date): string {
    return formatDate(date, 'MMM d, y HH:mm', 'en-US')
}