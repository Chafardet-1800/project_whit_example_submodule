import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputEmailComponent } from './input-email.component';

describe('CmmInputEmailComponent', () => {
  let component: CmmInputEmailComponent;
  let fixture: ComponentFixture<CmmInputEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmInputEmailComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmInputEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
