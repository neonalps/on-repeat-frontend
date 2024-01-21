import { Router } from "@angular/router";

export const PATH_PARAM_TRACK_ID = "trackId";

export function navigateToTrackDetails(router: Router, trackId: number): void {
    router.navigate(["/tracks", trackId]);
}