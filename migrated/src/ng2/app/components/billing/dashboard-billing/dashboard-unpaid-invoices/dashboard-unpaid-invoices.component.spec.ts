import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUnpaidInvoicesComponent } from './dashboard-unpaid-invoices.component';

describe('DashboardUnpaidInvoicesComponent', () => {
  let component: DashboardUnpaidInvoicesComponent;
  let fixture: ComponentFixture<DashboardUnpaidInvoicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUnpaidInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUnpaidInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
