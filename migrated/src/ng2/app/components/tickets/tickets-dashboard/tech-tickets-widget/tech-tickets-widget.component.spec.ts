import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechTicketsWidgetComponent } from './tech-tickets-widget.component';

describe('TechTicketsWidgetComponent', () => {
  let component: TechTicketsWidgetComponent;
  let fixture: ComponentFixture<TechTicketsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechTicketsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechTicketsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
