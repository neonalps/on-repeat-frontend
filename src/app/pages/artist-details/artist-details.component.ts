import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { DetailedArtistApiDto, ImageApiDto } from '@src/app/models';
import { ArtistService } from '@src/app/services/artist/artist.service';
import { isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { PATH_PARAM_ARTIST_SLUG, parseUrlSlug } from '@src/app/util/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, I18nPipe, LoadingComponent],
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.css'
})
export class ArtistDetailsComponent implements OnInit {

  isLoading: boolean = true;

  private artist!: DetailedArtistApiDto;

  constructor(
    private readonly artistService: ArtistService,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const artistId = parseUrlSlug(this.route.snapshot.paramMap.get(PATH_PARAM_ARTIST_SLUG) as string);
    this.artistService.fetchArtist(artistId).pipe(
      take(1)
    ).subscribe({
      next: response => {
        this.artist = response;
        this.isLoading = false;
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

}
