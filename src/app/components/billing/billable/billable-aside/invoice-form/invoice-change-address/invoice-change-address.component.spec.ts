import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceChangeAddressComponent } from './invoice-change-address.component';

describe('InvoiceChangeAddressComponent', () => {
  let component: InvoiceChangeAddressComponent;
  let fixture: ComponentFixture<InvoiceChangeAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceChangeAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceChangeAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
