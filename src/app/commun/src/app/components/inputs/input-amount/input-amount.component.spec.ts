import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputAmountComponent } from './input-amount.component';

describe('InputAmountComponent', () => {
  let component: CmmInputAmountComponent;
  let fixture: ComponentFixture<CmmInputAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmInputAmountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmInputAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
