import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTokenComponent } from './account-token.component';

describe('AccountTokenComponent', () => {
  let component: AccountTokenComponent;
  let fixture: ComponentFixture<AccountTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountTokenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AccountTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
