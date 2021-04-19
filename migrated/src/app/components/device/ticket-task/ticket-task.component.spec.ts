import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTaskComponent } from './ticket-task.component';

describe('TicketTaskComponent', () => {
  let component: TicketTaskComponent;
  let fixture: ComponentFixture<TicketTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
