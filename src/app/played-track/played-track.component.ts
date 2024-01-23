import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImageApiDto, PlayedTrackApiDto } from '@src/app/models';
import { getArtistsString } from '@src/app/util/common';
import { ExcludeComponent } from '@src/app/components/exclude/exclude.component';

@Component({
  selector: 'app-played-track',
  standalone: true,
  imports: [CommonModule, ExcludeComponent],
  templateUrl: './played-track.component.html',
  styleUrl: './played-track.component.css'
})
export class PlayedTrackComponent {

  @Input() playedTrack!: PlayedTrackApiDto;

  getArtists(): string {
    return getArtistsString(this.playedTrack.track.artists);
  }

  getTitle(): string {
    return this.playedTrack.track.name;
  }

  getPlayedAt(): Date {
    return new Date(this.playedTrack.playedAt);
  }

  getImageUrl(): string | undefined {
    return this.getImage()?.url;
  }

  getImageHeight(): number | undefined {
    return 64;
  }

  getImageWidth(): number | undefined {
    return 64;
  }

  isExcludedFromStatistics(): boolean {
    return this.playedTrack.includeInStatistics === false;
  }

  private getImage(): ImageApiDto | undefined {
    return this.playedTrack.track.album?.images[0];
  }

}
