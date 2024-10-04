import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingManufacturesComponent } from './device-setting-manufactures.component';

describe('DeviceSettingManufacturesComponent', () => {
  let component: DeviceSettingManufacturesComponent;
  let fixture: ComponentFixture<DeviceSettingManufacturesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingManufacturesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingManufacturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
