import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDevicesAsideDeviceIconComponent } from './company-devices-aside-device-icon.component';

describe('CompanyDevicesAsideDeviceIconComponent', () => {
  let component: CompanyDevicesAsideDeviceIconComponent;
  let fixture: ComponentFixture<CompanyDevicesAsideDeviceIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDevicesAsideDeviceIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDevicesAsideDeviceIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
