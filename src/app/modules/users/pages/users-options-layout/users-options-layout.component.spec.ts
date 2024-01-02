import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersOptionsLayoutComponent } from './users-options-layout.component';

describe('UsersOptionsLayoutComponent', () => {
  let component: UsersOptionsLayoutComponent;
  let fixture: ComponentFixture<UsersOptionsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersOptionsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersOptionsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
