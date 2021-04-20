import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormTicketEditProductComponent } from './invoice-form-ticket-edit-product.component';

describe('InvoiceFormTicketEditProductComponent', () => {
  let component: InvoiceFormTicketEditProductComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormTicketEditProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormTicketEditProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
