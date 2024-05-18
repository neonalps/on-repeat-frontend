import { Router } from "@angular/router";
import { isDefined } from "@src/app/util/common";

export const PATH_PARAM_ARTIST_SLUG = "artistSlug";
export const PATH_PARAM_TRACK_SLUG = "trackSlug";
export const PATH_PARAM_CHART_SLUG = "chartSlug";
export const PATH_PARAM_CHART_TYPE = "chartType";
export const PATH_PARAM_CHART_PERIOD_SLUG = "chartPeriodSlug";

export function navigateToTrackDetails(router: Router, trackId: number, trackName: string): void {
    router.navigate(["/tracks", createUrlSlug(trackId, trackName)]);
}

export function navigateToArtistDetails(router: Router, artistId: number, artistName: string): void {
    router.navigate(["/artists", createUrlSlug(artistId, artistName)]);
}

export function navigateToChartDetails(router: Router, chartId: number, chartName: string): void {
    router.navigate(["/charts", createUrlSlug(chartId, chartName)]);
}

export function navigateToAdHocChartDetails(router: Router, type: string, year?: number | null, month?: number | null): void {
    const calendarParts = [
        year,
        month
    ].filter(isDefined).join("-");

    router.navigate(["/charts/period", type, calendarParts].filter(item => !!item));
}

export function navigateToRecentlyPlayed(router: Router, from?: string, to?: string): void {
    const params: any = {};
    if (isDefined(from)) {
        params["from"] = from;
    }

    if (isDefined(to)) {
        params["to"] = to;
    }

    router.navigate(["/recently-played"], { queryParams: params });
}

export function parseUrlSlug(slug: string): number {
    const firstHyphenIdx = slug.indexOf("-");
    return firstHyphenIdx < 0 ? Number(slug) : Number(slug.substring(0, firstHyphenIdx));
}

export function createUrlSlug(id: number, name: string): string {
    return [id, ...name.split(" ").map(item => item.toLowerCase())].join("-").replace(/[^a-zA-Z0-9-_]/g, '');
}