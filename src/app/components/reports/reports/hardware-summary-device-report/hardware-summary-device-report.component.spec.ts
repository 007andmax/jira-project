import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSummaryDeviceReportComponent } from './hardware-summary-device-report.component';

describe('HardwareSummaryDeviceReportComponent', () => {
  let component: HardwareSummaryDeviceReportComponent;
  let fixture: ComponentFixture<HardwareSummaryDeviceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareSummaryDeviceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareSummaryDeviceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
