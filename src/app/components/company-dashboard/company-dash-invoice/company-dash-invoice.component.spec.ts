import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashInvoiceComponent } from './company-dash-invoice.component';

describe('CompanyDashInvoiceComponent', () => {
  let component: CompanyDashInvoiceComponent;
  let fixture: ComponentFixture<CompanyDashInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
