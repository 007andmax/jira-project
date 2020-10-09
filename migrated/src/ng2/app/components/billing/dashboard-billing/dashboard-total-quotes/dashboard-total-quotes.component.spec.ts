import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardTotalQuotesComponent } from './dashboard-total-quotes.component';

describe('DashboardTotalQuotesComponent', () => {
  let component: DashboardTotalQuotesComponent;
  let fixture: ComponentFixture<DashboardTotalQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardTotalQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardTotalQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
