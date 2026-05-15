import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportProductItemManufactureComponent } from './ticket-preview-report-product-item-manufacture.component';

describe('TicketPreviewReportProductItemManufactureComponent', () => {
  let component: TicketPreviewReportProductItemManufactureComponent;
  let fixture: ComponentFixture<TicketPreviewReportProductItemManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportProductItemManufactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportProductItemManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
