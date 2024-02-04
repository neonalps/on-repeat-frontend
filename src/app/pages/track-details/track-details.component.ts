import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CheckboxChangeEvent, ToggleCheckboxComponent } from '@src/app/components/toggle-checkbox/toggle-checkbox.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { DetailedTrackApiDto, DetailedTrackChartApiDto, ImageApiDto, PlayedHistoryApiDto } from '@src/app/models';
import { PlayedTrackService } from '@src/app/services/played-track/played-track.service';
import { TrackService } from '@src/app/services/track/track.service';
import { hasText, isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { getEarliestDateOfArray, getLatestDateOfArray } from '@src/app/util/date';
import { PATH_PARAM_TRACK_SLUG, navigateToArtistDetails, navigateToChartDetails, parseUrlSlug } from '@src/app/util/router';
import { take } from 'rxjs';

interface SimpleArtist {
  id: number;
  name: string;
  href: string;
}

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [
    CommonModule, 
    I18nPipe, 
    LoadingComponent, 
    ToggleCheckboxComponent,
  ],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {

  isLoading: boolean = true;
  isTrackHistoryLoading: boolean = true;
  trackHistory: PlayedHistoryApiDto[] = [];

  private track!: DetailedTrackApiDto;
  private trackHistoryNextPageKey: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly trackService: TrackService, 
    private readonly playedTrackService: PlayedTrackService
  ) {}

  ngOnInit(): void {
    const trackId = parseUrlSlug(this.route.snapshot.paramMap.get(PATH_PARAM_TRACK_SLUG) as string);
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

  onToggleChange(event: CheckboxChangeEvent, playedTrack: PlayedHistoryApiDto) {
    this.updatePlayedTrackIncludeInStatistics(playedTrack.playedTrackId, event.newChecked);
  }

  updatePlayedTrackIncludeInStatistics(playedTrackId: number, includeInStatistics: boolean) {
    this.playedTrackService.updateIncludeInStatistics(playedTrackId, includeInStatistics).pipe(
      take(1),
    ).subscribe({
      next: updatedPlayedHistory => {
        this.updatePlayedTrackItem(playedTrackId, updatedPlayedHistory);
        this.updatePlayedInfo();
      },
      error: error => {
        // TODO display modal?
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

  getArtists(): SimpleArtist[] {
    return this.track.artists.map(artist => {
      return {
        id: artist.id,
        name: artist.name,
        href: artist.href,
      }
    });
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

  getChartEntryPlaceBackgroundColor(place: number): string {
    return place === 1 ? 'bg-color-primary-lighter-30' : 'bg-color-dark-grey-lighter-30';
  }

  getChartEntries(): DetailedTrackChartApiDto[] {
    return this.hasChartEntries() ? this.track.charts as DetailedTrackChartApiDto[] : [];
  }

  hasChartEntries(): boolean {
    return this.track.charts !== undefined && this.track.charts.length > 0;
  }

  goToArtist(artistId: number, artistName: string): void {
    navigateToArtistDetails(this.router, artistId, artistName);
  }

  goToChartDetails(chartId: number, chartName: string): void {
    navigateToChartDetails(this.router, chartId, chartName);
  }

  private updatePlayedTrackItem(playedTrackId: number, updatedItem: PlayedHistoryApiDto): void {
    const itemIdx = this.trackHistory.findIndex(item => item.playedTrackId === playedTrackId);
    if (itemIdx < 0) {
      return;
    }
    this.trackHistory[itemIdx] = updatedItem;
  }

  private updatePlayedInfo(): void {
    const playedDates: Date[] = this.trackHistory
      .filter(item => item.includeInStatistics)
      .map(item => item.playedAt);

    const timesPlayed = playedDates.length;

    this.track.playedInfo = {
      timesPlayed,
      firstPlayedAt: getEarliestDateOfArray(playedDates),
      lastPlayedAt: getLatestDateOfArray(playedDates),
    };
  }
}
