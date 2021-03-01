import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareSummaryReportComponent } from './hardware-summary-report.component';

describe('HardwareSummaryReportComponent', () => {
  let component: HardwareSummaryReportComponent;
  let fixture: ComponentFixture<HardwareSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HardwareSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HardwareSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
