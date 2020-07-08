import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormTicketEditTaxesComponent } from './invoice-form-ticket-edit-taxes.component';

describe('InvoiceFormTicketEditTaxesComponent', () => {
  let component: InvoiceFormTicketEditTaxesComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditTaxesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormTicketEditTaxesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormTicketEditTaxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
