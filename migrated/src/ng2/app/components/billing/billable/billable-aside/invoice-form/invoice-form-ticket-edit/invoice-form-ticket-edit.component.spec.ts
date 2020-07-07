import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormTicketEditComponent } from './invoice-form-ticket-edit.component';

describe('InvoiceFormTicketEditComponent', () => {
  let component: InvoiceFormTicketEditComponent;
  let fixture: ComponentFixture<InvoiceFormTicketEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormTicketEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormTicketEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
