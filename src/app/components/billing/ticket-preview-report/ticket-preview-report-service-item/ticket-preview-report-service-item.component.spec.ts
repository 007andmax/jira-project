import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportServiceItemComponent } from './ticket-preview-report-service-item.component';

describe('TicketPreviewReportServiceItemComponent', () => {
  let component: TicketPreviewReportServiceItemComponent;
  let fixture: ComponentFixture<TicketPreviewReportServiceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportServiceItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportServiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
