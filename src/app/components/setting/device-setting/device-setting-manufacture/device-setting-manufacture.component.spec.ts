import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingManufactureComponent } from './device-setting-manufacture.component';

describe('DeviceSettingManufactureComponent', () => {
  let component: DeviceSettingManufactureComponent;
  let fixture: ComponentFixture<DeviceSettingManufactureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingManufactureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
