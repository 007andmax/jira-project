import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailMessageComponent } from './ticket-detail-message.component';

describe('TicketDetailMessageComponent', () => {
  let component: TicketDetailMessageComponent;
  let fixture: ComponentFixture<TicketDetailMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
