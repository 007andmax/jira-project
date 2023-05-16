import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDetailsDashboardComponent } from './dashboard-details-dashboard.component';

describe('DashboardDetailsDashboardComponent', () => {
  let component: DashboardDetailsDashboardComponent;
  let fixture: ComponentFixture<DashboardDetailsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDetailsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
