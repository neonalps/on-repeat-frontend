import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartPeriodComponent } from './chart-period.component';

describe('ChartPeriodComponent', () => {
  let component: ChartPeriodComponent;
  let fixture: ComponentFixture<ChartPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartPeriodComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
