import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputPasswordComponent } from './input-password.component';

describe('CmmInputPasswordComponent', () => {
  let component: CmmInputPasswordComponent;
  let fixture: ComponentFixture<CmmInputPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmInputPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CmmInputPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
