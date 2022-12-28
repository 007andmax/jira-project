import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeviceSummaryComponent } from './report-device-summary.component';

describe('ReportDeviceSummaryComponent', () => {
  let component: ReportDeviceSummaryComponent;
  let fixture: ComponentFixture<ReportDeviceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDeviceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeviceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
