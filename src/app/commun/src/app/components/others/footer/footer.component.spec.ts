import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmmFooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: CmmFooterComponent;
  let fixture: ComponentFixture<CmmFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmmFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmmFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
