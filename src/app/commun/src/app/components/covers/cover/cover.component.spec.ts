import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmCoverComponent } from './cover.component';

describe('CmmCoverComponent', () => {
  let component: CmmCoverComponent;
  let fixture: ComponentFixture<CmmCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmCoverComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
