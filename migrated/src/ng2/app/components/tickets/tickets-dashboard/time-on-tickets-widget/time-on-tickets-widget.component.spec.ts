import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeOnTicketsWidgetComponent } from './time-on-tickets-widget.component';

describe('TimeOnTicketsWidgetComponent', () => {
  let component: TimeOnTicketsWidgetComponent;
  let fixture: ComponentFixture<TimeOnTicketsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeOnTicketsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeOnTicketsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
