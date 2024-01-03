import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCoverComponent } from './table-cover.component';

describe('TableCoverComponent', () => {
  let component: TableCoverComponent;
  let fixture: ComponentFixture<TableCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
