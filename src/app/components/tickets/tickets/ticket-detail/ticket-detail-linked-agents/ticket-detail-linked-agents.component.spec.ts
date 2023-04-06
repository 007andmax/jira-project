import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailLinkedAgentsComponent } from './ticket-detail-linked-agents.component';

describe('TicketDetailLinkedAgentsComponent', () => {
  let component: TicketDetailLinkedAgentsComponent;
  let fixture: ComponentFixture<TicketDetailLinkedAgentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailLinkedAgentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailLinkedAgentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
