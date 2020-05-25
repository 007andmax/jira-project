import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsPrioritiesComponent } from './tickets-priorities.component';

describe('TicketsPrioritiesComponent', () => {
  let component: TicketsPrioritiesComponent;
  let fixture: ComponentFixture<TicketsPrioritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsPrioritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsPrioritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
