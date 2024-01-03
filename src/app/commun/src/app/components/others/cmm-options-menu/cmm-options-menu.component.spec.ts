import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmOptionsMenuComponent } from './cmm-options-menu.component';

describe('CmmOptionsMenuComponent', () => {
  let component: CmmOptionsMenuComponent;
  let fixture: ComponentFixture<CmmOptionsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmOptionsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmOptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
