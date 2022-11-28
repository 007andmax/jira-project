import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingDeviceTypeComponent } from './device-setting-device-type.component';

describe('DeviceSettingDeviceTypeComponent', () => {
  let component: DeviceSettingDeviceTypeComponent;
  let fixture: ComponentFixture<DeviceSettingDeviceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingDeviceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingDeviceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
