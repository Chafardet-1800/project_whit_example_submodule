import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestApisComponent } from './test-apis.component';

describe('TestApisComponent', () => {
  let component: TestApisComponent;
  let fixture: ComponentFixture<TestApisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestApisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestApisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
