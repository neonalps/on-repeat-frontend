import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { ToggleCheckboxComponent } from '@src/app/components/toggle-checkbox/toggle-checkbox.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { DetailedTrackApiDto, ImageApiDto, PlayedHistoryApiDto } from '@src/app/models';
import { PlayedTracksService } from '@src/app/services/played-tracks/played-tracks.service';
import { TrackService } from '@src/app/services/track/track.service';
import { getArtistsString, hasText, isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { PATH_PARAM_TRACK_ID } from '@src/app/util/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule, I18nPipe, LoadingComponent, ToggleCheckboxComponent],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {

  isLoading: boolean = true;
  isTrackHistoryLoading: boolean = true;
  trackHistory: PlayedHistoryApiDto[] = [];

  private track!: DetailedTrackApiDto;
  private trackHistoryNextPageKey: string | null = null;

  constructor(private route: ActivatedRoute, private trackService: TrackService, private playedTrackService: PlayedTracksService) {}

  ngOnInit(): void {
    const trackId = Number(this.route.snapshot.paramMap.get(PATH_PARAM_TRACK_ID));
    this.trackService.fetchTrack(trackId).pipe(
      take(1)
    ).subscribe({
      next: response => {
        this.track = response;
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        console.error(error);
      }
    });

    this.playedTrackService.fetchTrackPlayedHistory(trackId).pipe(
      take(1),
    ).subscribe({
      next: response => {
        this.trackHistory = response.items;
        this.trackHistoryNextPageKey = hasText(response.nextPageKey) ? response.nextPageKey as string : null;
        this.isTrackHistoryLoading = false;
      },
      error: error => {
        this.isTrackHistoryLoading = false;
        console.error(error);
      }
    })
  }

  getImageUrl(): string | undefined {
    const image = pickImageFromArray(this.track.album?.images, 'medium');
    if (isNotDefined(image)) {
      return;
    }

    return (image as ImageApiDto).url;
  }

  getName(): string {
    return this.track.name;
  }

  getArtists(): string {
    return getArtistsString(this.track.artists);
  }

  getAlbum(): string | undefined {
    return this.track.album?.name;
  }

  getTimesPlayed(): number {
    return this.track.playedInfo.timesPlayed;
  }

  getFirstPlayedAt(): Date | null {
    return this.track.playedInfo.firstPlayedAt;
  }

  getLastPlayedAt(): Date | null {
    return this.track.playedInfo.lastPlayedAt;
  }
}
