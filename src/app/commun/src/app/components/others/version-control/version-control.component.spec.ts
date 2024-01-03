import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmmVersionControlComponent } from './version-control.component';

describe('CmmVersionControlComponent', () => {
  let component: CmmVersionControlComponent;
  let fixture: ComponentFixture<CmmVersionControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmmVersionControlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmVersionControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
