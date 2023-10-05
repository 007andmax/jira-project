import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsStatisticsTableItemComponent } from './contracts-statistics-table-item.component';

describe('ContractsStatisticsTableItemComponent', () => {
  let component: ContractsStatisticsTableItemComponent;
  let fixture: ComponentFixture<ContractsStatisticsTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsStatisticsTableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsStatisticsTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
