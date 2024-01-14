import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ImageApiDto, PlayedTrackApiDto } from '@src/app/models';
import { ToggleCheckboxComponent } from '@src/app/toggle-checkbox/toggle-checkbox.component';

interface ArtistLink {
  id: number;
  name: string;
}

@Component({
  selector: 'app-played-track',
  standalone: true,
  imports: [CommonModule, ToggleCheckboxComponent],
  templateUrl: './played-track.component.html',
  styleUrl: './played-track.component.css'
})
export class PlayedTrackComponent {

  @Input() playedTrack!: PlayedTrackApiDto;

  getArtists(): ArtistLink[] {
    return this.playedTrack.track.artists.map(artist => {
      return {
        id: artist.id,
        name: artist.name,
      }
    })
    .reverse();
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

  private getImage(): ImageApiDto | undefined {
    return this.playedTrack.track.album?.images[0];
  }

}
