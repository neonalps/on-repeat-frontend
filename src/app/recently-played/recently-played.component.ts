import { Component } from '@angular/core';
import { PlayedTracksService } from '@src/app/played-tracks/played-tracks.service';
import { PaginatedResponseDto, PlayedTrackApiDto } from '@src/app/models';
import { first } from 'rxjs';
import { AuthService } from '@src/app/auth/auth.service';
import { CommonModule } from '@angular/common';
import { PlayedTrackComponent } from '@src/app/played-track/played-track.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { groupBy } from '@src/app/util/collection';
import { isDefined } from '@src/app/util/common';
import { getGroupableDateString } from '@src/app/util/date';
import { ScrollNearEndDirective } from '@src/app/directives/scroll-near-end/scroll-near-end.directive';
import { ReloadComponent } from '@src/app/reload/reload.component';
import { FilterComponent } from '@src/app/filter/filter.component';
import { HttpErrorResponse } from '@angular/common/http';
import { loginRedirect } from '@src/app/auth/guards/loggedin.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recently-played',
  standalone: true,
  imports: [
    CommonModule,
    FilterComponent,
    I18nPipe,
    PlayedTrackComponent,
    ReloadComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './recently-played.component.html',
  styleUrl: './recently-played.component.css'
})
export class RecentlyPlayedComponent {

  loading: boolean = false;
  playedTracksOnDate: PlayedTracksOnDate[] = [];
  
  private nextPageKey: string | null = null;

  constructor(
      private readonly authService: AuthService, 
      private readonly playedTracksService: PlayedTracksService,
      private readonly router: Router,
  ) {
    this.loadRecentlyPlayedTracks();
  }

  loadMore(): void {
    if (!this.isLoadMoreAvailable()) {
      return;
    }

    this.loadRecentlyPlayedTracks(this.nextPageKey as string);
  }

  isLoadMoreAvailable(): boolean {
    return !this.loading && isDefined(this.nextPageKey);
  }

  onNearEndScroll(): void {
    this.loadMore();
  }

  private loadRecentlyPlayedTracks(nextPageKey?: string): void {
    this.loading = true;

    this.playedTracksService.fetchRecentlyPlayedTracks(this.authService.getAccessToken() as string, nextPageKey)
      .pipe(first())
      .subscribe({
        next: (response: PaginatedResponseDto<PlayedTrackApiDto>) => {
          this.processIncomingPlayedTracks(response.items);
          this.nextPageKey = isDefined(response.nextPageKey) ? response.nextPageKey as string : null;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 401) {
            loginRedirect(this.router, this.router.url);
            return;
          }

          this.loading = false;
        } 
      });
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

interface PlayedTracksOnDate {
  date: string;
  tracks: PlayedTrackApiDto[];
}