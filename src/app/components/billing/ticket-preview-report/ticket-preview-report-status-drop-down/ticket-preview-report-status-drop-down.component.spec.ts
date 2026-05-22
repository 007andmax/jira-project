import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportStatusDropDownComponent } from './ticket-preview-report-status-drop-down.component';

describe('TicketPreviewReportStatusDropDownComponent', () => {
  let component: TicketPreviewReportStatusDropDownComponent;
  let fixture: ComponentFixture<TicketPreviewReportStatusDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportStatusDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportStatusDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
