import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileInfoApiDto } from '@src/app/models';
import { environment } from '@src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private static readonly PROFILE_INFO_URL =`${environment.apiBaseUrl}/api/v1/accounts/profile-info`;

  constructor(private readonly http: HttpClient) {}

  fetchProfileInfo(): Observable<ProfileInfoApiDto> {
    return this.http.get<ProfileInfoApiDto>(ProfileService.PROFILE_INFO_URL);
  }
}
