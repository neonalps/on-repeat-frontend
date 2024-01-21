import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingComponent } from '@src/app/components/loading/loading.component';
import { I18nPipe } from '@src/app/i18n/i18n.pipe';
import { DetailedTrackApiDto, ImageApiDto } from '@src/app/models';
import { TrackService } from '@src/app/services/track/track.service';
import { getArtistsString, isNotDefined, pickImageFromArray } from '@src/app/util/common';
import { PATH_PARAM_TRACK_ID } from '@src/app/util/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-track-details',
  standalone: true,
  imports: [CommonModule, I18nPipe, LoadingComponent],
  templateUrl: './track-details.component.html',
  styleUrl: './track-details.component.css'
})
export class TrackDetailsComponent implements OnInit {

  isLoading: boolean = true;

  private track!: DetailedTrackApiDto;

  constructor(private route: ActivatedRoute, private trackService: TrackService) {}

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
