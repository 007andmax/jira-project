import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingModelComponent } from './device-setting-model.component';

describe('DeviceSettingModelComponent', () => {
  let component: DeviceSettingModelComponent;
  let fixture: ComponentFixture<DeviceSettingModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
