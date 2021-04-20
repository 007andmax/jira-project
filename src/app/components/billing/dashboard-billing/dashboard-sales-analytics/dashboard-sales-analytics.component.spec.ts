import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSalesAnalyticsComponent } from './dashboard-sales-analytics.component';

describe('DashboardSalesAnalyticsComponent', () => {
  let component: DashboardSalesAnalyticsComponent;
  let fixture: ComponentFixture<DashboardSalesAnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSalesAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSalesAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
