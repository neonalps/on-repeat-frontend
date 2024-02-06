import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDetailsChartItemComponent } from './artist-details-chart-item.component';

describe('ArtistDetailsChartItemComponent', () => {
  let component: ArtistDetailsChartItemComponent;
  let fixture: ComponentFixture<ArtistDetailsChartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistDetailsChartItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistDetailsChartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
