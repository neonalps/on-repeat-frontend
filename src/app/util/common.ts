import { ArtistApiDto, ImageApiDto } from "@src/app/models";

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

export function getArtistsString(artists: ArtistApiDto[]): string {
    if (isNotDefined(artists)) {
        return "";
    }

    return artists.map(artist => artist.name).join(", ");
}

export function milliSecondsToMinutesAndSeconds(ms: number): [number, number] {
    if (ms === 0) {
        return [0, 0];
    }

    const start = Math.floor(ms / 1000);
    const minutes = Math.floor(start / 60);
    const seconds = start % 60;

    return [minutes, seconds];
}

export type ImageSize = 'small' | 'medium' | 'large';
export function pickImageFromArray(images: ImageApiDto[] | undefined, mode: ImageSize): ImageApiDto | null {
    if (isNotDefined(images) || (images as ImageApiDto[]).length === 0) {
        return null;
    }

    const sortedByLargestSize = (images as ImageApiDto[]).sort((a: ImageApiDto, b: ImageApiDto) => {
        const sizeA = a.height;
        const sizeB = b.height;

        if (sizeA > sizeB) {
            return -1;
        } else if (sizeB > sizeA) {
            return 1;
        } else {
            return 0;
        }
    });

    const itemIdx = determineItemIdx(mode, sortedByLargestSize.length);
    return sortedByLargestSize[itemIdx];
}

function determineItemIdx(mode: ImageSize, arraySize: number): number {
    if (mode === 'large') {
        return 0;
    } else if (mode === 'small') {
        return arraySize - 1;
    } else {
        return Math.floor(arraySize / 2);
    }
}