import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmOptionCardComponent } from './cmm-option-card.component';

describe('CmmOptionCardComponent', () => {
  let component: CmmOptionCardComponent;
  let fixture: ComponentFixture<CmmOptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmOptionCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
