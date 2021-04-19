import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormTicketInfoComponent } from './invoice-form-ticket-info.component';

describe('InvoiceFormTicketInfoComponent', () => {
  let component: InvoiceFormTicketInfoComponent;
  let fixture: ComponentFixture<InvoiceFormTicketInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormTicketInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormTicketInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
