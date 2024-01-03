import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let component: CmmButtonComponent;
  let fixture: ComponentFixture<CmmButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
