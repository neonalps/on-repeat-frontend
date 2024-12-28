import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountJobComponent } from './account-job.component';

describe('AccountJobComponent', () => {
  let component: AccountJobComponent;
  let fixture: ComponentFixture<AccountJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountJobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
