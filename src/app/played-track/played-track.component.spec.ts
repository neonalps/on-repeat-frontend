import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayedTrackComponent } from './played-track.component';

describe('PlayedTrackComponent', () => {
  let component: PlayedTrackComponent;
  let fixture: ComponentFixture<PlayedTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayedTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayedTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
