import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceIpSummaryDeviceReportComponent } from './device-ip-summary-device-report.component';

describe('DeviceIpSummaryDeviceReportComponent', () => {
  let component: DeviceIpSummaryDeviceReportComponent;
  let fixture: ComponentFixture<DeviceIpSummaryDeviceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceIpSummaryDeviceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceIpSummaryDeviceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
