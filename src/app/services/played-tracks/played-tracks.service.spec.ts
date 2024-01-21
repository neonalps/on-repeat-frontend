import { TestBed } from '@angular/core/testing';

import { PlayedTracksService } from './played-tracks.service';

describe('RecentlyPlayedService', () => {
  let service: PlayedTracksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayedTracksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
