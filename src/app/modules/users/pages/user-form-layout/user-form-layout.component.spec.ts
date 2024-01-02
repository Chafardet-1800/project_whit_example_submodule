import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFormLayoutComponent } from './user-form-layout.component';

describe('UserFormLayoutComponent', () => {
  let component: UserFormLayoutComponent;
  let fixture: ComponentFixture<UserFormLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFormLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserFormLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
