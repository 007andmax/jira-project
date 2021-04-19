import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDatepickerDashboardComponent } from './multi-datepicker-dashboard.component';

describe('MultiDatepickerDashboardComponent', () => {
  let component: MultiDatepickerDashboardComponent;
  let fixture: ComponentFixture<MultiDatepickerDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiDatepickerDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDatepickerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
