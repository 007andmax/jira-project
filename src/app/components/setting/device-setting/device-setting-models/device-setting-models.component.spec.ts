import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceSettingModelsComponent } from './device-setting-models.component';

describe('DeviceSettingModelsComponent', () => {
  let component: DeviceSettingModelsComponent;
  let fixture: ComponentFixture<DeviceSettingModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceSettingModelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceSettingModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
