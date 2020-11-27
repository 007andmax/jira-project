import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashRevenueComponent } from './company-dash-revenue.component';

describe('CompanyDashRevenueComponent', () => {
  let component: CompanyDashRevenueComponent;
  let fixture: ComponentFixture<CompanyDashRevenueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashRevenueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
