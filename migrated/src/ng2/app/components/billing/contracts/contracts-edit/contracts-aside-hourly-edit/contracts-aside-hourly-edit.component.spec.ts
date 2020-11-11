import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyEditComponent } from './contracts-aside-hourly-edit.component';

describe('ContractsAsideHourlyEditComponent', () => {
  let component: ContractsAsideHourlyEditComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideHourlyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
