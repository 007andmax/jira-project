import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportComponent } from './ticket-preview-report.component';

describe('TicketPreviewReportComponent', () => {
  let component: TicketPreviewReportComponent;
  let fixture: ComponentFixture<TicketPreviewReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
