import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideOtherServiceComponent } from './contracts-aside-other-service.component';

describe('ContractsAsideOtherServiceComponent', () => {
  let component: ContractsAsideOtherServiceComponent;
  let fixture: ComponentFixture<ContractsAsideOtherServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideOtherServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideOtherServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
