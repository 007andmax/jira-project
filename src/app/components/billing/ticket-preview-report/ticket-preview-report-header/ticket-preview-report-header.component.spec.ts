import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportHeaderComponent } from './ticket-preview-report-header.component';

describe('TicketPreviewReportHeaderComponent', () => {
  let component: TicketPreviewReportHeaderComponent;
  let fixture: ComponentFixture<TicketPreviewReportHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
