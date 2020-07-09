import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDiscountComponent } from './invoice-discount.component';

describe('InvoiceDiscountComponent', () => {
  let component: InvoiceDiscountComponent;
  let fixture: ComponentFixture<InvoiceDiscountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceDiscountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceDiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
