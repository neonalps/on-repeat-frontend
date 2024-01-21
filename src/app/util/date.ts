import { validateDefined } from "@src/app/util/validation";

export function getDateWithoutTime(input: Date): Date {
    validateDefined(input, "input");

    return new Date(input.toDateString());
}

export function getDateFromUnixTimestamp(unix: number): Date {
    return new Date(unix * 1000);
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