import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthSpotifyComponent } from './oauth.spotify.component';

describe('OauthSpotifyComponent', () => {
  let component: OauthSpotifyComponent;
  let fixture: ComponentFixture<OauthSpotifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSpotifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OauthSpotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
