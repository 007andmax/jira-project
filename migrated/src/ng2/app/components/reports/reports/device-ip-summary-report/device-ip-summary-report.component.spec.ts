import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceIpSummaryReportComponent } from './device-ip-summary-report.component';

describe('DeviceIpSummaryReportComponent', () => {
  let component: DeviceIpSummaryReportComponent;
  let fixture: ComponentFixture<DeviceIpSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceIpSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceIpSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
