import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, NavigationSkipped, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AccountChartItemComponent, ChartItem } from '@src/app/components/account-chart-item/account-chart-item.component';
import { ArtistDetailsChartItemComponent } from '@src/app/components/artist-details-chart-item/artist-details-chart-item.component';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { ScrollNearEndDirective } from '@src/app/directives/scroll-near-end/scroll-near-end.directive';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { ArtistPlayedTrackApiDto, DetailedArtistApiDto, DetailedArtistChartApiDto, ImageApiDto } from '@src/app/models';
import { ArtistService } from '@src/app/services/artist/artist.service';
import { PlayedTrackService } from '@src/app/services/played-track/played-track.service';
import { AppState } from '@src/app/store.index';
import { hideSearch } from '@src/app/ui-state/store/ui-state.actions';
import { hasText, isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { PATH_PARAM_ARTIST_SLUG, parseUrlSlug } from '@src/app/util/router';
import { Subject, take, throttleTime } from 'rxjs';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [
    AccountChartItemComponent,
    ArtistDetailsChartItemComponent, 
    CommonModule, 
    I18nPipe, 
    LoadingComponent,
    ScrollNearEndDirective,
  ],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent {

  isLoading: boolean = true;
  isPlayedTracksLoading: boolean = false;

  private artist!: DetailedArtistApiDto;
  private playedTracksNextPageKey?: string;
  private artistPlayedTracks: ChartItem[] = [];

  private scrollEndSubject = new Subject<void>();

  constructor(
    private readonly artistService: ArtistService,
    private readonly playedTrackService: PlayedTrackService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<AppState>,
  ) {
    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.artistPlayedTracks = [];

          this.loadArtistDetails();
        } else if (value instanceof NavigationSkipped) {
          this.store.dispatch(hideSearch());
        }
      });

      this.scrollEndSubject.pipe(
        takeUntilDestroyed(),
        throttleTime(200)
      ).subscribe(() => this.loadMore());
  }

  loadArtistDetails(): void {
    const artistId = parseUrlSlug(this.route.snapshot.paramMap.get(PATH_PARAM_ARTIST_SLUG) as string);
    this.artistService.fetchArtist(artistId).pipe(
      take(1)
    ).subscribe({
      next: response => {
        this.artist = response;
        this.isLoading = false;
        this.loadPlayedTracks();
      },
      error: error => {
        this.isLoading = false;
        console.error(error);
      }
    }); 
  }

  getImageUrl(): string | undefined {
    const image = pickImageFromArray(this.artist.images, 'medium');
    if (isNotDefined(image)) {
      return;
    }

    return (image as ImageApiDto).url;
  }

  getName(): string {
    return this.artist.name;
  }

  getTimesPlayed(): number {
    return this.artist.playedInfo.timesPlayed;
  }

  getFirstPlayedAt(): Date | null {
    return this.artist.playedInfo.firstPlayedAt;
  }

  getLastPlayedAt(): Date | null {
    return this.artist.playedInfo.lastPlayedAt;
  }

  getChartEntryPlaceBackgroundColor(place: number): string {
    return place === 1 ? 'bg-color-primary-lighter-30' : 'bg-color-dark-grey-lighter-30';
  }

  getChartEntries(): ChartItem[] {
    return this.hasChartEntries() ? this.convertToChartItems(this.artist.charts) : [];
  }

  hasChartEntries(): boolean {
    return this.artist.charts !== undefined && this.artist.charts.length > 0;
  }

  onNearEndScroll(): void {
    this.scrollEndSubject.next();
  }

  isLoadMoreAvailable(): boolean {
    return !this.isPlayedTracksLoading && hasText(this.playedTracksNextPageKey);
  }

  loadMore(): void {
    if (!this.isLoadMoreAvailable()) {
      return;
    }

    this.loadPlayedTracks();
  }

  loadPlayedTracks() {
    this.isPlayedTracksLoading = true;
    this.playedTrackService.fetchArtistPlayedTracks(this.artist.id, this.playedTracksNextPageKey)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.playedTracksNextPageKey = response.nextPageKey;
          this.convertPlayedTracksResponse(response.items);
          this.isPlayedTracksLoading = false;
        },
        error: error => {
          console.error(error);
          this.isPlayedTracksLoading = false;
        }
      })
  }

  convertPlayedTracksResponse(items: ArtistPlayedTrackApiDto[]): void {
    const chartItems = items.map(item => {
      const image = pickImageFromArray(item.album?.images, "small");

      return {
        chartId: 0,
        chartName: "",
        place: 0,
        itemId: item.id,
        name: item.name,
        playCount: item.timesPlayed,
        artists: [],
        album: null,
        imageUrl: image !== null ? image.url : null,
        type: "track",
      };
    });

    this.artistPlayedTracks.push(...chartItems);
  }

  getPlayedTracks(): ChartItem[] {
    return this.artistPlayedTracks;
  }

  private convertToChartItems(entries?: DetailedArtistChartApiDto[]): ChartItem[] {
    if (!entries) {
      return [];
    }

    return entries.map(entry => {
      const imageUrl = pickImageFromArray(entry.track.album?.images, "small");

      return {
        chartId: entry.chart.id,
        chartName: entry.chart.name,
        itemId: entry.track.id,
        imageUrl: imageUrl !== null ? imageUrl.url : null,
        place: entry.place,
        playCount: entry.playCount,
        name: entry.track.name,
        artists: [],
        album: null,
        type: 'track',
      }
    });
  }

}
