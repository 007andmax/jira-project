import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUnbilledAmountComponent } from './dashboard-unbilled-amount.component';

describe('DashboardUnbilledAmountComponent', () => {
  let component: DashboardUnbilledAmountComponent;
  let fixture: ComponentFixture<DashboardUnbilledAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUnbilledAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUnbilledAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
