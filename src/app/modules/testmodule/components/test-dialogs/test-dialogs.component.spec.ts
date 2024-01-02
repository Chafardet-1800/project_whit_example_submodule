import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDialogsComponent } from './test-dialogs.component';

describe('TestDialogsComponent', () => {
  let component: TestDialogsComponent;
  let fixture: ComponentFixture<TestDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestDialogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
