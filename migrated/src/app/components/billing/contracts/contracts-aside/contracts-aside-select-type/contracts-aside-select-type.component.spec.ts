import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideSelectTypeComponent } from './contracts-aside-select-type.component';

describe('ContractsAsideSelectTypeComponent', () => {
  let component: ContractsAsideSelectTypeComponent;
  let fixture: ComponentFixture<ContractsAsideSelectTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideSelectTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideSelectTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
