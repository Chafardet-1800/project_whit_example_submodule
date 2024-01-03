import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CmmTableMainComponent } from './table-main.component';

describe('CmmTableMainComponent', () => {
  let component: CmmTableMainComponent;
  let fixture: ComponentFixture<CmmTableMainComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CmmTableMainComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmmTableMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
