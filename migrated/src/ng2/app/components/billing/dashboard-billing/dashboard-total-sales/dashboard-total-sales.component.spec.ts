import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTotalSalesComponent } from './dashboard-total-sales.component';

describe('DashboardTotalSalesComponent', () => {
  let component: DashboardTotalSalesComponent;
  let fixture: ComponentFixture<DashboardTotalSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTotalSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTotalSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
