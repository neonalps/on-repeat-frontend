import { Component } from '@angular/core';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PlayedTrackComponent } from '@src/app/played-track/played-track.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { ScrollNearEndDirective } from '@src/app/directives/scroll-near-end/scroll-near-end.directive';
import { ReloadComponent } from '@src/app/reload/reload.component';
import { FilterComponent } from '@src/app/filter/filter.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { navigateToTrackDetails } from '@src/app/util/router';
import { PlayedTracksOnDate, PlayedTracksService } from '@src/app/services/played-tracks/played-tracks.service';
import { isDefined } from '../util/common';

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

  constructor(private readonly router: Router, private readonly playedTracksService: PlayedTracksService) {
    const loadedPlayedTracks = this.playedTracksService.getRecentlyPlayedTracks();
    if (isDefined(loadedPlayedTracks) && loadedPlayedTracks.length > 0) {
      this.playedTracksOnDate = loadedPlayedTracks;
    } else {
      this.loadRecentlyPlayedTracks();
    }
  }

  loadMore(): void {
    if (!this.isLoadMoreAvailable()) {
      return;
    }

    this.loadRecentlyPlayedTracks();
  }

  isLoadMoreAvailable(): boolean {
    return !this.loading && this.playedTracksService.areMoreRecentlyPlayedTracksAvailable();
  }

  onNearEndScroll(): void {
    this.loadMore();
  }

  goToTrack(id: number): void {
    navigateToTrackDetails(this.router, id);
  }

  private loadRecentlyPlayedTracks(): void {
    this.loading = true;

    this.playedTracksService.loadRecentlyPlayedTracks()
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

