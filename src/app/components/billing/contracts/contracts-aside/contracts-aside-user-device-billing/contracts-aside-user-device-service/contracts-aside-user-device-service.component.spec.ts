import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideUserDeviceServiceComponent } from './contracts-aside-user-device-service.component';

describe('ContractsAsideUserDeviceServiceComponent', () => {
  let component: ContractsAsideUserDeviceServiceComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideUserDeviceServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideUserDeviceServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
