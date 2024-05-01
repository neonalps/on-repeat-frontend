import { Component } from '@angular/core';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PlayedTrackComponent } from '@src/app/played-track/played-track.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { ScrollNearEndDirective } from '@src/app/directives/scroll-near-end/scroll-near-end.directive';
import { ReloadComponent } from '@src/app/reload/reload.component';
import { FilterComponent } from '@src/app/filter/filter.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NavigationEnd, Router } from '@angular/router';
import { navigateToTrackDetails } from '@src/app/util/router';
import { PlayedTracksOnDate, PlayedTrackService } from '@src/app/services/played-track/played-track.service';
import { isDefined } from '@src/app/util/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  constructor(private readonly router: Router, private readonly playedTrackService: PlayedTrackService) {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          const urlParts = value.url.split("?");

          if (urlParts.length === 1) {
            this.init();
          } else {
            const queryParams = Object.fromEntries(new URLSearchParams(urlParts[1]).entries());
            this.init(queryParams["from"], queryParams["to"]);
          }
        }
      });
  }

  init(from?: string | null, to?: string | null) {
    if (isDefined(from) && isDefined(to)) {
      this.loadRecentlyPlayedTracks(true, from, to);
      return;
    }

    this.loadRecentlyPlayedTracks(true);
  }

  loadMore(): void {
    if (!this.isLoadMoreAvailable()) {
      return;
    }

    this.loadRecentlyPlayedTracks(false);
  }

  isLoadMoreAvailable(): boolean {
    return !this.loading && this.playedTrackService.areMoreRecentlyPlayedTracksAvailable();
  }

  onNearEndScroll(): void {
    this.loadMore();
  }

  goToTrack(id: number, name: string): void {
    navigateToTrackDetails(this.router, id, name);
  }

  private loadRecentlyPlayedTracks(shouldReset: boolean, from?: string | null, to?: string | null): void {
    this.loading = true;

    this.playedTrackService.loadRecentlyPlayedTracks(shouldReset, from, to)
      .pipe(take(1))
      .subscribe({
        next: (tracks: PlayedTracksOnDate[]) => {
          this.playedTracksOnDate = tracks;
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
          this.loading = false;
        } 
      });
  }
}

