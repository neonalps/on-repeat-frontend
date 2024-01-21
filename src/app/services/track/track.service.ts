import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailedTrackApiDto } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private static readonly TRACKS_URL =`${environment.apiBaseUrl}/api/v1/tracks`;

  constructor(private readonly http: HttpClient) {}

  fetchTrack(trackId: number): Observable<DetailedTrackApiDto> {
    const requestUrl = `${TrackService.TRACKS_URL}/${trackId}`;
    return this.http.get<DetailedTrackApiDto>(requestUrl);
  }
}
