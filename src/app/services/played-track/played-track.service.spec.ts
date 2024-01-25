import { TestBed } from '@angular/core/testing';

import { PlayedTrackService } from './played-track.service';

describe('RecentlyPlayedService', () => {
  let service: PlayedTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayedTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
