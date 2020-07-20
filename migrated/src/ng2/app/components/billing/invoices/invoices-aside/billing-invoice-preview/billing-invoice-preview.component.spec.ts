import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingInvoicePreviewComponent } from './billing-invoice-preview.component';

describe('BillingInvoicePreviewComponent', () => {
  let component: BillingInvoicePreviewComponent;
  let fixture: ComponentFixture<BillingInvoicePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingInvoicePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingInvoicePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
