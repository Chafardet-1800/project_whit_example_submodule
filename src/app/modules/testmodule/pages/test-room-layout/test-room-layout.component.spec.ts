import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestRoomLayoutComponent } from './test-room-layout.component';

describe('TestRoomLayoutComponent', () => {
  let component: TestRoomLayoutComponent;
  let fixture: ComponentFixture<TestRoomLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestRoomLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestRoomLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
