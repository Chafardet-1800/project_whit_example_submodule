import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputDateComponent } from './input-date.component';

describe('CmmInputDateComponent', () => {
  let component: CmmInputDateComponent;
  let fixture: ComponentFixture<CmmInputDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmInputDateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmInputDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
