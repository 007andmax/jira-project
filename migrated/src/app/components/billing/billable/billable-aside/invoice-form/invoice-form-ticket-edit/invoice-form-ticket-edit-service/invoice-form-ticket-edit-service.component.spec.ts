import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormTicketEditServiceComponent } from './invoice-form-ticket-edit-service.component';

describe('InvoiceFormTicketEditServiceComponent', () => {
  let component: InvoiceFormTicketEditServiceComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormTicketEditServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormTicketEditServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
