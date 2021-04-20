import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceFormEditCustomerComponent } from './invoice-form-edit-customer.component';

describe('InvoiceFormEditCustomerComponent', () => {
  let component: InvoiceFormEditCustomerComponent;
  let fixture: ComponentFixture<InvoiceFormEditCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceFormEditCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceFormEditCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
