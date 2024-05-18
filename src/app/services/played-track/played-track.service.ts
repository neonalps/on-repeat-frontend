import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { ArtistPlayedTrackApiDto, PaginatedResponseDto, PlayedHistoryApiDto, PlayedTrackApiDto } from '@src/app/models';
import { Observable, of, switchMap, take, tap } from 'rxjs';
import { API_QUERY_PARAM_NEXT_PAGE_KEY, hasText, isDefined, isNotDefined } from '@src/app/util/common';
import { getGroupableDateString } from '@src/app/util/date';
import { groupBy } from '@src/app/util/collection';

// recently played tracks
export interface PlayedTracksOnDate {
  date: string;
  tracks: PlayedTrackApiDto[];
}

// track details: played history
export interface TrackHistoryOnDate {
  date: string;
  historyItems: PlayedHistoryApiDto[];
}

export interface TrackHistoryLoadingTuple {
  currentItems: TrackHistoryOnDate[],
  moreAvailable: boolean,
}

@Injectable({
  providedIn: 'root'
})
export class PlayedTrackService {

  private static readonly PLAYED_TRACKS_URL =`${environment.apiBaseUrl}/api/v1/played-tracks`;

  // recently played tracks
  private nextPageKey: string | null = null;
  private playedTracksOnDate: PlayedTracksOnDate[] = [];

  // track details: played history
  private playedHistoryMap: Map<number, TrackHistoryOnDate[]> = new Map();
  private playedHistoryNextPageKeyMap: Map<number, string> = new Map();

  constructor(private readonly http: HttpClient) {}

  getRecentlyPlayedTracks(): PlayedTracksOnDate[] {
    return this.playedTracksOnDate;
  }

  loadRecentlyPlayedTracks(shouldReset: boolean, from?: string | null, to?: string | null): Observable<PlayedTracksOnDate[]> {
    if (shouldReset) {
      this.nextPageKey = null;
      this.playedTracksOnDate = [];
    }

    return this.fetchRecentlyPlayedTracks(from, to)
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

  fetchTrackPlayedHistory(trackId: number): Observable<TrackHistoryLoadingTuple> {
    const nextPageKey = this.playedHistoryNextPageKeyMap.get(trackId);
    const existingItems = this.playedHistoryMap.get(trackId);

    if (existingItems !== undefined && existingItems.length > 0 && !hasText(nextPageKey)) {
      return of({
        currentItems: existingItems,
        moreAvailable: false,
      });
    }

    const queryParams = new URLSearchParams();
    if (hasText(nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, nextPageKey as string);
    }

    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}/tracks/${trackId}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<PlayedHistoryApiDto>>(requestUrl)
      .pipe(
        take(1),
        switchMap((response: PaginatedResponseDto<PlayedHistoryApiDto>) => {
         this.processIncomingPlayedHistoryItems(trackId, response.items);

         const moreAvailable = hasText(response.nextPageKey);
         if (moreAvailable) {
          this.playedHistoryNextPageKeyMap.set(trackId, response.nextPageKey as string);
         } else {
          this.playedHistoryNextPageKeyMap.delete(trackId);
         }

         return of({
          currentItems: this.playedHistoryMap.get(trackId) as TrackHistoryOnDate[],
          moreAvailable,
         });
        })
    ) ;
  }

  updateIncludeInStatistics(playedTrackId: number, includeInStatistics: boolean): Observable<PlayedHistoryApiDto> {
    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}/${playedTrackId}`;
    return this.http.post<PlayedHistoryApiDto>(requestUrl, { includeInStatistics })
      .pipe(
        tap(updatedItem => {
          const dateString = getGroupableDateString(new Date(updatedItem.playedAt));
          const storedTracksOnDate = this.playedTracksOnDate.find(item => item.date === dateString);
          if (!isDefined(storedTracksOnDate)) {
            return;
          }

          const storedPlayedTrack = storedTracksOnDate?.tracks.find(item => item.playedTrackId === updatedItem.playedTrackId);
          if (!isDefined(storedPlayedTrack)) {
            return;
          }

          (storedPlayedTrack as PlayedTrackApiDto).includeInStatistics = updatedItem.includeInStatistics;
        }),
      );
  }

  fetchArtistPlayedTracks(artistId: number, nextPageKey?: string): Observable<PaginatedResponseDto<ArtistPlayedTrackApiDto>> {
    const queryParams = new URLSearchParams();
    if (nextPageKey) {
      queryParams.append("nextPageKey", nextPageKey);
    }

    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}/artists/${artistId}${queryParams.size > 0 ? '?' + queryParams.toString() : ""}`;
    return this.http.get<PaginatedResponseDto<ArtistPlayedTrackApiDto>>(requestUrl);
  }

  private fetchRecentlyPlayedTracks(from?: string | null, to?: string | null): Observable<PaginatedResponseDto<PlayedTrackApiDto>> {
    const queryParams = new URLSearchParams();
    if (isDefined(this.nextPageKey)) {
      queryParams.set(API_QUERY_PARAM_NEXT_PAGE_KEY, this.nextPageKey as string);
    }

    if (isDefined(from)) {
      queryParams.set("from", from as string);
    }

    if (isDefined(to)) {
      queryParams.set("to", to as string);
    }

    const requestUrl = `${PlayedTrackService.PLAYED_TRACKS_URL}?${queryParams.toString()}`;
    return this.http.get<PaginatedResponseDto<PlayedTrackApiDto>>(requestUrl);
  }

  private processIncomingPlayedTracks(items: PlayedTrackApiDto[]): void {
    const groupedTracks = groupBy(items, (track: PlayedTrackApiDto) => getGroupableDateString(new Date(track.playedAt)));

    for (const [date, tracks] of groupedTracks) {
      const currentTracksOnDate = this.playedTracksOnDate.find(item => item.date === date);

      if (isDefined(currentTracksOnDate)) {
        const currentItems = (currentTracksOnDate as PlayedTracksOnDate).tracks;

        for (const incomingTrack of tracks) {
          // this allows us to load items in an idempotent way - even if they have already been loaded before, they will only get added once
          // this helps for filtering for a certain date
          if (!currentItems.find(item => item.playedTrackId === incomingTrack.playedTrackId)) {
            currentItems.push(incomingTrack);
          }
        }
      } else {
        this.playedTracksOnDate.push({
          date,
          tracks
        });
      }
    }
  }

  private processIncomingPlayedHistoryItems(trackId: number, items: PlayedHistoryApiDto[]): void {
    const playedHistoryOnDate = this.playedHistoryMap.get(trackId) || [];
    const groupedHistoryItems = groupBy(items, (historyItem: PlayedHistoryApiDto) => getGroupableDateString(new Date(historyItem.playedAt)));

    for (const [date, historyItems] of groupedHistoryItems) {
      const currentHistoryOnDate = playedHistoryOnDate.find(item => item.date === date);

      if (isDefined(currentHistoryOnDate)) {
        (currentHistoryOnDate as TrackHistoryOnDate).historyItems.push(...historyItems);
      } else {
        playedHistoryOnDate.push({
          date,
          historyItems,
        });
      }
    }

    this.playedHistoryMap.set(trackId, playedHistoryOnDate);
  }

}
