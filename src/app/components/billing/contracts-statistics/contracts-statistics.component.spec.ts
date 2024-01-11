import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsStatisticsComponent } from './contracts-statistics.component';

describe('ContractsStatisticsComponent', () => {
  let component: ContractsStatisticsComponent;
  let fixture: ComponentFixture<ContractsStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
