import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuotesComponent } from './dashboard-quotes.component';

describe('DashboardQuotesComponent', () => {
  let component: DashboardQuotesComponent;
  let fixture: ComponentFixture<DashboardQuotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardQuotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardQuotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
