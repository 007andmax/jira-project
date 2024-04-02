import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingManufacturesAddComponent } from './device-setting-manufactures-add.component';

describe('DeviceSettingManufacturesAddComponent', () => {
  let component: DeviceSettingManufacturesAddComponent;
  let fixture: ComponentFixture<DeviceSettingManufacturesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingManufacturesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingManufacturesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
