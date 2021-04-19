import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideUserDeviceEditComponent } from './contracts-aside-user-device-edit.component';

describe('ContractsAsideUserDeviceEditComponent', () => {
  let component: ContractsAsideUserDeviceEditComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideUserDeviceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideUserDeviceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
