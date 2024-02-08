import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@src/environments/environment';
import { FullTextSearchResponseApiDto } from '../models';
import { Observable, of } from 'rxjs';
import { isNotDefined } from '@src/app/util/common';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private static readonly SEARCH_URL =`${environment.apiBaseUrl}/api/v1/search`;

  constructor(private readonly http: HttpClient) {}

  search(input: string): Observable<FullTextSearchResponseApiDto> {
    if (isNotDefined(input) || input.trim().length === 0) {
      return of({ results: [] });
    }

    return this.http.post<FullTextSearchResponseApiDto>(SearchService.SEARCH_URL, { search: input });
  }
}
