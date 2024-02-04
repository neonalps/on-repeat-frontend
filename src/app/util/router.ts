import { Router } from "@angular/router";

export const PATH_PARAM_ARTIST_SLUG = "artistSlug";
export const PATH_PARAM_TRACK_SLUG = "trackSlug";
export const PATH_PARAM_CHART_SLUG = "chartSlug";

export function navigateToTrackDetails(router: Router, trackId: number, trackName: string): void {
    router.navigate(["/tracks", createUrlSlug(trackId, trackName)]);
}

export function navigateToArtistDetails(router: Router, artistId: number, artistName: string): void {
    router.navigate(["/artists", createUrlSlug(artistId, artistName)]);
}

export function navigateToChartDetails(router: Router, chartId: number, chartName: string): void {
    router.navigate(["/charts", createUrlSlug(chartId, chartName)]);
}

export function parseUrlSlug(slug: string): number {
    const firstHyphenIdx = slug.indexOf("-");
    return firstHyphenIdx < 0 ? Number(slug) : Number(slug.substring(0, firstHyphenIdx));
}

export function createUrlSlug(id: number, name: string): string {
    return [id, ...name.split(" ").map(item => item.toLowerCase())].join("-").replace(/[^a-zA-Z0-9-_]/g, '');
}