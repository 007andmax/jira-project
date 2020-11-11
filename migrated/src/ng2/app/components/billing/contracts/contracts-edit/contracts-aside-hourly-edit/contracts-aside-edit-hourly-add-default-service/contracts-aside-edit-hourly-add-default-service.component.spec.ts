import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideEditHourlyAddDefaultServiceComponent } from './contracts-aside-edit-hourly-add-default-service.component';

describe('ContractsAsideEditHourlyAddDefaultServiceComponent', () => {
  let component: ContractsAsideEditHourlyAddDefaultServiceComponent;
  let fixture: ComponentFixture<ContractsAsideEditHourlyAddDefaultServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideEditHourlyAddDefaultServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideEditHourlyAddDefaultServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
