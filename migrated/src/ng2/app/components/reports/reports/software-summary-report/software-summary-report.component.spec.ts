import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareSummaryReportComponent } from './software-summary-report.component';

describe('SoftwareSummaryReportComponent', () => {
  let component: SoftwareSummaryReportComponent;
  let fixture: ComponentFixture<SoftwareSummaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftwareSummaryReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftwareSummaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
