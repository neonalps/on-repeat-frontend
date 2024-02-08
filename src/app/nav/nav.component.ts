import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectMenuVisible, selectSearchVisible } from '@src/app/ui-state/store/ui-state.selectors';
import { AppState } from '@src/app/store.index';
import { hideMenu, hideSearch, toggleMenu, toggleSearch } from '@src/app/ui-state/store/ui-state.actions';
import { AppLogoComponent } from '@src/app/app-logo/app-logo.component';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { selectAuthUser } from '@src/app/auth/store/auth.selectors';
import { AccountChartApiDto, AlbumApiDto, ArtistApiDto, AuthUser, ChartApiDto, FullTextSearchResponseApiDto, SearchResultItemApiDto, TrackApiDto } from '@src/app/models';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { AuthService } from '@src/app/auth/auth.service';
import { SearchComponent } from '@src/app/components/search/search.component';
import { SearchService } from '@src/app/services/search.service';
import { Subject, debounceTime, exhaustMap, tap } from 'rxjs';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { isDefined, pickImageFromArray } from '@src/app/util/common';
import { navigateToArtistDetails, navigateToChartDetails, navigateToTrackDetails } from '../util/router';

interface SearchResultItem {
  type: string;
  imageUrl: string | null;
  itemId: number;
  name: string;
  artists: string | null;
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    AppLogoComponent,
    CommonModule,
    I18nPipe,
    LoadingComponent,
    RouterModule,
    SearchComponent,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  isSearching: boolean = false;
  hasSearched: boolean = false;
  menuVisible$ = this.store.select(selectMenuVisible);
  searchVisible$ = this.store.select(selectSearchVisible);
  searchResults: SearchResultItem[] = [];
  user: AuthUser | null = null;

  private searchSubject = new Subject<string>();

  constructor(
    private readonly authService: AuthService, 
    private readonly router: Router, 
    private readonly searchService: SearchService,
    private readonly store: Store<AppState>
  ) {
    this.store.select(selectAuthUser)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        this.user = value;
      });

      this.store.select(selectSearchVisible)
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value === true) {
          this.focusSearch(200);
        } else {
          this.resetSearch();
        }
      })

    this.router.events
      .pipe(takeUntilDestroyed())
      .subscribe(value => {
        if (value instanceof NavigationEnd) {
          this.hideMenu();
        }
      });

    this.searchSubject.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      tap(() => this.isSearching = true),
      exhaustMap(value => this.searchService.search(value))
    ).subscribe(response => this.processSearchResult(response));
  }

  focusSearch(delayMs?: number): void {
    setTimeout(() => this.searchElement.nativeElement.focus(), delayMs); 
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  hideMenu() {
    this.store.dispatch(hideMenu());
  }

  hideSearch() {
    this.store.dispatch(hideSearch()); 
  }

  logout() {
    this.hideMenu();
    this.hideSearch();
    this.authService.signOut();
  }

  resetSearch(): void {
    this.hasSearched = false;
    this.searchResults = [];

    if (this.searchElement && this.searchElement.nativeElement) {
      this.searchElement.nativeElement.value = "";
    }
  }

  shouldShowEmptySearch(): boolean {
    return this.hasSearched && this.searchElement.nativeElement.value.trim() !== "";
  }

  onSearchChange(event: any) {
    this.searchSubject.next(event.target.value);
  }

  toggleMenu() {
    this.store.dispatch(toggleMenu());
  }

  toggleSearch() {
    this.store.dispatch(toggleSearch());
  }

  itemSelected(item: SearchResultItem) {
    switch (item.type) {
      case "track":
        navigateToTrackDetails(this.router, item.itemId, item.name);
        break;
      case "artist":
        navigateToArtistDetails(this.router, item.itemId, item.name);
        break;
      case "chart":
        navigateToChartDetails(this.router, item.itemId, item.name);
        break;
      default:
        console.warn(`No item select handler defined for type ${item.type}`);
    }
  }

  private processSearchResult(response: FullTextSearchResponseApiDto) {
    this.searchResults = response.results.map(item => {
      switch (item.type) {
        case "track":
          return this.processTrackResult(item);
        case "artist":
          return this.processArtistResult(item);
        case "album":
          return this.processAlbumResult(item);
        case "chart":
          return this.processChartResult(item);
        default:
          console.warn(`Unknown search result type ${item.type}`);
          return null;
      }
    }).filter(item => isDefined(item)) as SearchResultItem[];

    this.isSearching = false;
    this.hasSearched = true;
  }

  private processTrackResult(item: SearchResultItemApiDto): SearchResultItem {
    const track = item.item as TrackApiDto;
    const image = pickImageFromArray(track.album?.images, 'small');

    return {
      type: item.type,
      name: track.name,
      imageUrl: image !== null ? image.url : null,
      artists: track.artists.map(artist => artist.name).join(", "),
      itemId: track.id,
    }
  }

  private processArtistResult(item: SearchResultItemApiDto): SearchResultItem {
    const artist = item.item as ArtistApiDto;
    const image = pickImageFromArray(artist.images, 'small');

    return {
      type: item.type,
      name: artist.name,
      imageUrl: image !== null ? image.url : null,
      artists: null,
      itemId: artist.id,
    }
  }

  private processAlbumResult(item: SearchResultItemApiDto): SearchResultItem {
    const album = item.item as AlbumApiDto;
    const image = pickImageFromArray(album.images, 'small');

    return {
      type: item.type,
      name: album.name,
      imageUrl: image !== null ? image.url : null,
      artists: null, // TODO this should be fixed
      itemId: album.id,
    }
  }

  private processChartResult(item: SearchResultItemApiDto): SearchResultItem {
    const chart = item.item as AccountChartApiDto;

    return {
      type: item.type,
      name: chart.name,
      imageUrl: null,
      artists: null,
      itemId: chart.id,
    }
  }

}
