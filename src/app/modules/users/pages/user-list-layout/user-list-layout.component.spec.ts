import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserListLayoutComponent } from './user-list-layout.component';

describe('UserListLayoutComponent', () => {
  let component: UserListLayoutComponent;
  let fixture: ComponentFixture<UserListLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
