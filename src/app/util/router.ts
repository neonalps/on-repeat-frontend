import { Router } from "@angular/router";

export const PATH_PARAM_ARTIST_ID = "artistId";
export const PATH_PARAM_TRACK_ID = "trackId";

export function navigateToTrackDetails(router: Router, trackId: number): void {
    router.navigate(["/tracks", trackId]);
}

export function navigateToArtistDetails(router: Router, artistId: number): void {
    router.navigate(["/artists", artistId]);
}