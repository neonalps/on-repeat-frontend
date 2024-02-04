import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountChartItemComponent } from './account-chart-item.component';

describe('AccountChartItemComponent', () => {
  let component: AccountChartItemComponent;
  let fixture: ComponentFixture<AccountChartItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountChartItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountChartItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
