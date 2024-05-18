import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { CheckboxChangeEvent, ToggleCheckboxComponent } from '@src/app/components/toggle-checkbox/toggle-checkbox.component';
import { ScrollNearEndDirective } from '@src/app/directives/scroll-near-end/scroll-near-end.directive';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { TranslationService } from '@src/app/i18n/translation.service';
import { DetailedTrackApiDto, DetailedTrackChartApiDto, ImageApiDto, PlayedHistoryApiDto } from '@src/app/models';
import { PlayedTrackService, TrackHistoryOnDate } from '@src/app/services/played-track/played-track.service';
import { TrackService } from '@src/app/services/track/track.service';
import { hideSearch } from '@src/app/ui-state/store/ui-state.actions';
import { isNotDefined, milliSecondsToMinutesAndSeconds, pickImageFromArray } from '@src/app/util/common';
import { getEarliestDateOfArray, getEndOfDayIsoString, getGroupableDateString, getLatestDateOfArray, getStartOfDayIsoString } from '@src/app/util/date';
import { PATH_PARAM_TRACK_SLUG, navigateToArtistDetails, navigateToChartDetails, navigateToRecentlyPlayed, parseUrlSlug } from '@src/app/util/router';
import { Subject, take, throttleTime } from 'rxjs';

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
    ScrollNearEndDirective,
    ToggleCheckboxComponent,
  ],
  providers: [
    DatePipe,
  ],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent {

  isLoading: boolean = false;
  isTrackHistoryLoading: boolean = true;
  isMoreTrackHistoryAvailable: boolean = true;
  trackHistoryOnDate: TrackHistoryOnDate[] = [];
  trackId: number | null = null;

  private track!: DetailedTrackApiDto;
  private scrollEndSubject = new Subject<void>();

  constructor(
    private readonly datePipe: DatePipe,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store,
    private readonly trackService: TrackService,
    private readonly translationService: TranslationService,
    private readonly playedTrackService: PlayedTrackService,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.loadTrackDetails();
        } else if (value instanceof NavigationSkipped) {
          this.store.dispatch(hideSearch());
        }
      });

      this.scrollEndSubject.pipe(
        takeUntilDestroyed(),
        throttleTime(200)
      ).subscribe(() => this.loadMore());
  }

  loadTrackDetails(): void {
    this.isLoading = true;
    this.trackHistoryOnDate = [];
    this.trackId = parseUrlSlug(this.route.snapshot.paramMap.get(PATH_PARAM_TRACK_SLUG) as string);
    this.trackService.fetchTrack(this.trackId).pipe(
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

    this.loadTrackHistory();
  }

  onToggleChange(event: CheckboxChangeEvent, playedTrack: PlayedHistoryApiDto) {
    const includeInStatistics = event.newChecked;
    this.updatePlayedTrackIncludeInStatistics(playedTrack.playedTrackId, includeInStatistics);
    
    // dynamically update the property in the stored dataset in the component
    const dateString = getGroupableDateString(new Date(playedTrack.playedAt));
    const items = this.trackHistoryOnDate.find(item => item.date === dateString);
    if (!items) {
      return;
    }
    const item = items.historyItems.find(historyItem => historyItem.playedTrackId === playedTrack.playedTrackId);
    if (!item) {
      return;
    }
    item.includeInStatistics = includeInStatistics;

    if (includeInStatistics) {
      this.track.playedInfo.timesPlayed++;
    } else {
      this.track.playedInfo.timesPlayed--;
    }

    this.track.playedInfo.lastPlayedAt = this.findLastIncludedInStatistics();

    if (!this.isMoreTrackHistoryAvailable) {
      this.track.playedInfo.firstPlayedAt = this.findFirstIncludedInStatistics();
    }
  }

  updatePlayedTrackIncludeInStatistics(playedTrackId: number, includeInStatistics: boolean) {
    this.playedTrackService.updateIncludeInStatistics(playedTrackId, includeInStatistics).pipe(
      take(1),
    ).subscribe({
      error: error => {
        // TODO display modal?
        console.error(error);
      }
    });
  }

  private findFirstIncludedInStatistics(): Date | null {
    return getEarliestDateOfArray(this.getAllPresentInclduingInStatisticsHistoryItemDates())
  }

  private findLastIncludedInStatistics(): Date | null {
    return getLatestDateOfArray(this.getAllPresentInclduingInStatisticsHistoryItemDates())
  }
  
  private getAllPresentInclduingInStatisticsHistoryItemDates() {
    return this.trackHistoryOnDate
      .map(dateItem => dateItem.historyItems)
      .flat()
      .filter(playedHistoryItem => playedHistoryItem.includeInStatistics === true)
      .map(playedHistoryItem => playedHistoryItem.playedAt);
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

  getReleaseDateString(): string | null {
    if (!this.track.releaseDate) {
      return null;
    }

    const releaseDate = this.track.releaseDate.releaseDate;
    const precision = this.track.releaseDate.precision;
    if (precision === "day") {
      return this.datePipe.transform(releaseDate, "MMMM d, y");
    } else if (precision === "month") {
      return this.datePipe.transform(releaseDate, "MMMM y");
    } else if (precision === "year") {
      return this.datePipe.transform(releaseDate, "y");
    } else {
      return releaseDate;
    }
  }

  getChartEntryPlaceBackgroundColor(place: number): string {
    return place === 1 ? 'bg-color-primary-lighter-30' : 'bg-color-dark-grey-lighter-30';
  }

  getChartEntries(): DetailedTrackChartApiDto[] {
    return this.hasChartEntries() ? this.track.charts as DetailedTrackChartApiDto[] : [];
  }

  getDuration(): string | null {
    const duration = this.track.durationMs;
    if (isNotDefined(duration)) {
      return null;
    }

    const minutesAndSeconds = milliSecondsToMinutesAndSeconds(duration as number);

    const secondsString = `${minutesAndSeconds[1]}`.padStart(2, '0');
    return `${minutesAndSeconds[0]}:${secondsString} min`;
  }

  getTrackHistoryOnDate() {
    return this.trackHistoryOnDate;
  }

  getTimesPlayedOnDay(items: PlayedHistoryApiDto[]): string | null {
    const includeInStatisticsPlays = items.filter(item => item.includeInStatistics === true).length;

    if (includeInStatisticsPlays <= 1) {
      return null;
    }

    return `${items.length} ${this.translationService.translate('times')}`;
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

  goToDate(date: string): void {
    navigateToRecentlyPlayed(this.router, getStartOfDayIsoString(date), getEndOfDayIsoString(date));
  }

  onNearEndScroll(): void {
    this.scrollEndSubject.next();
  }

  loadMore(): void {
    if (this.isTrackHistoryLoading || !this.isMoreTrackHistoryAvailable) {
      return;
    }

    this.isTrackHistoryLoading = true;
    this.loadTrackHistory();
  }

  private loadTrackHistory() {
    this.playedTrackService.fetchTrackPlayedHistory(this.trackId as number).pipe(
      take(1),
    ).subscribe({
      next: response => {
        this.trackHistoryOnDate = response.currentItems;
        this.isMoreTrackHistoryAvailable = response.moreAvailable;
        this.isTrackHistoryLoading = false;
      },
      error: error => {
        this.isTrackHistoryLoading = false;
        this.isMoreTrackHistoryAvailable = false;
        console.error(error);
      }
    })
  }
}
