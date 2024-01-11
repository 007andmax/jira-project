import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsStatisticsTableComponent } from './contracts-statistics-table.component';

describe('ContractsStatisticsTableComponent', () => {
  let component: ContractsStatisticsTableComponent;
  let fixture: ComponentFixture<ContractsStatisticsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsStatisticsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsStatisticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
