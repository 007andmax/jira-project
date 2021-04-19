import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashStatsComponent } from './company-dash-stats.component';

describe('CompanyDashStatsComponent', () => {
  let component: CompanyDashStatsComponent;
  let fixture: ComponentFixture<CompanyDashStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
