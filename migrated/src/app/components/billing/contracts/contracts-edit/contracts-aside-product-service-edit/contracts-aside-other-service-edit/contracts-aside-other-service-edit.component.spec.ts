import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideOtherServiceEditComponent } from './contracts-aside-other-service-edit.component';

describe('ContractsAsideOtherServiceEditComponent', () => {
  let component: ContractsAsideOtherServiceEditComponent;
  let fixture: ComponentFixture<ContractsAsideOtherServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideOtherServiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideOtherServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
