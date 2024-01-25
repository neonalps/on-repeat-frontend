import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { PaginatedResponseDto, PlayedHistoryApiDto, PlayedTrackApiDto } from '@src/app/models';
import { Observable, of, switchMap, take } from 'rxjs';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, hasText, isDefined } from '@src/app/util/common';
import { getGroupableDateString } from '@src/app/util/date';
import { groupBy } from '@src/app/util/collection';

export interface PlayedTracksOnDate {
  date: string;
  tracks: PlayedTrackApiDto[];
}

@Injectable({
  providedIn: 'root'
})
export class PlayedTrackService {

  private static readonly PLAYED_TRACKS_URL =`${environment.apiBaseUrl}/api/v1/played-tracks`;

  private nextPageKey: string | null = null;
  private playedTracksOnDate: PlayedTracksOnDate[] = [];

  constructor(private readonly http: HttpClient) {}

  getRecentlyPlayedTracks(): PlayedTracksOnDate[] {
    return this.playedTracksOnDate;
  }

  loadRecentlyPlayedTracks(): Observable<PlayedTracksOnDate[]> {
    return this.fetchRecentlyPlayedTracks()
      .pipe(
        take(1),
        switchMap((response: PaginatedResponseDto<PlayedTrackApiDto>) => {
          this.processIncomingPlayedTracks(response.items);
          this.nextPageKey = hasText(response.nextPageKey) ? response.nextPageKey as string : null;
          return of(this.playedTracksOnDate);
        })
      );
  }

  areMoreRecentlyPlayedTracksAvailable(): boolean {
    return hasText(this.nextPageKey);
  }

  fetchTrackPlayedHistory(trackId: number, trackNextPageKey?: string): Observable<PaginatedResponseDto<PlayedHistoryApiDto>> {
    const queryParams = new URLSearchParams();
    if (hasText(trackNextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, trackNextPageKey as string);
    }

    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}/tracks/${trackId}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<PlayedHistoryApiDto>>(requestUrl);
  }

  private fetchRecentlyPlayedTracks(): Observable<PaginatedResponseDto<PlayedTrackApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(this.nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, this.nextPageKey as string);
    }

    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<PlayedTrackApiDto>>(requestUrl);
  }

  private processIncomingPlayedTracks(items: PlayedTrackApiDto[]): void {
    const groupedTracks = groupBy(items, (track: PlayedTrackApiDto) => getGroupableDateString(new Date(track.playedAt)));

    for (const [date, tracks] of groupedTracks) {
      const currentTracksOnDate = this.playedTracksOnDate.find(item => item.date === date);

      if (isDefined(currentTracksOnDate)) {
        (currentTracksOnDate as PlayedTracksOnDate).tracks.push(...tracks);
      } else {
        this.playedTracksOnDate.push({
          date,
          tracks
        });
      }
    }
  }

}
