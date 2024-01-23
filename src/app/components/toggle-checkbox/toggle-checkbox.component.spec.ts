import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCheckboxComponent } from './toggle-checkbox.component';

describe('ToggleCheckboxComponent', () => {
  let component: ToggleCheckboxComponent;
  let fixture: ComponentFixture<ToggleCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCheckboxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToggleCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
