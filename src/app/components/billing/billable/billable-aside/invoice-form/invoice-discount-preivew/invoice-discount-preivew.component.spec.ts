import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDiscountPreivewComponent } from './invoice-discount-preivew.component';

describe('InvoiceDiscountPreivewComponent', () => {
  let component: InvoiceDiscountPreivewComponent;
  let fixture: ComponentFixture<InvoiceDiscountPreivewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDiscountPreivewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDiscountPreivewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
