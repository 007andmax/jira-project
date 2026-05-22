import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportProductItemComponent } from './ticket-preview-report-product-item.component';

describe('TicketPreviewReportProductItemComponent', () => {
  let component: TicketPreviewReportProductItemComponent;
  let fixture: ComponentFixture<TicketPreviewReportProductItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportProductItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportProductItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
