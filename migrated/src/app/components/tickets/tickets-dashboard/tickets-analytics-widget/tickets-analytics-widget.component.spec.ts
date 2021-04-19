import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsAnalyticsWidgetComponent } from './tickets-analytics-widget.component';

describe('TicketsAnalyticsWidgetComponent', () => {
  let component: TicketsAnalyticsWidgetComponent;
  let fixture: ComponentFixture<TicketsAnalyticsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsAnalyticsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsAnalyticsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
