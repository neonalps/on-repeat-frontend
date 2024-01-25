import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DetailedArtistApiDto } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  private static readonly ARTISTS_URL =`${environment.apiBaseUrl}/api/v1/artists`;

  constructor(private readonly http: HttpClient) {}

  fetchArtist(artistId: number): Observable<DetailedArtistApiDto> {
    const requestUrl = `${ArtistService.ARTISTS_URL}/${artistId}`;
    return this.http.get<DetailedArtistApiDto>(requestUrl);
  }
}
