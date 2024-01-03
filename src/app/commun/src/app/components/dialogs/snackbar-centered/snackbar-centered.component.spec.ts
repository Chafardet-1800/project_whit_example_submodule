import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmSnackbarCenteredComponent } from './snackbar-centered.component';

describe('SnackbarCenteredComponent', () => {
  let component: CmmSnackbarCenteredComponent;
  let fixture: ComponentFixture<CmmSnackbarCenteredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmSnackbarCenteredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmSnackbarCenteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
