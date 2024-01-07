import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { PaginatedResponseDto, PlayedTrackApiDto } from '@src/app/models';
import { Observable } from 'rxjs';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, isDefined } from '@src/app/util/common';
import { getHeaderWithAuthorization } from '@src/app/util/http';

@Injectable({
  providedIn: 'root'
})
export class PlayedTracksService {

  private static readonly PLAYED_TRACKS_URL =`${environment.apiBaseUrl}/api/v1/played-tracks`;

  constructor(private readonly http: HttpClient) {}

  fetchRecentlyPlayedTracks(accessToken: string, nextPageKey?: string): Observable<PaginatedResponseDto<PlayedTrackApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, nextPageKey as string);
    }

    const requestUrl = `${PlayedTracksService.PLAYED_TRACKS_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<PlayedTrackApiDto>>(requestUrl, getHeaderWithAuthorization(accessToken));
  }

}
