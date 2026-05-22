import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketPreviewReportProductItemDropDownComponent } from './ticket-preview-report-product-item-drop-down.component';

describe('TicketPreviewReportProductItemDropDownComponent', () => {
  let component: TicketPreviewReportProductItemDropDownComponent;
  let fixture: ComponentFixture<TicketPreviewReportProductItemDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketPreviewReportProductItemDropDownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketPreviewReportProductItemDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
