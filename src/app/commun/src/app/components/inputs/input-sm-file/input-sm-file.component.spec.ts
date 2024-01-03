import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmInputSmFileComponent } from './input-sm-file.component';

describe('CmmInputSmFileComponent', () => {
  let component: CmmInputSmFileComponent;
  let fixture: ComponentFixture<CmmInputSmFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CmmInputSmFileComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmInputSmFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
