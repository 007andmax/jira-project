import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingModelsAddComponent } from './device-setting-models-add.component';

describe('DeviceSettingModelsAddComponent', () => {
  let component: DeviceSettingModelsAddComponent;
  let fixture: ComponentFixture<DeviceSettingModelsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingModelsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingModelsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
