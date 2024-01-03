import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputTextComponent } from './input-text.component';

describe('CmmInputTextComponent', () => {
  let component: CmmInputTextComponent;
  let fixture: ComponentFixture<CmmInputTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmInputTextComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmInputTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
