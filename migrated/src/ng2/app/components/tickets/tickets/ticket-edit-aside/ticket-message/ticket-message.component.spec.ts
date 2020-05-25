import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketMessageComponent } from './ticket-message.component';

describe('TicketMessageComponent', () => {
  let component: TicketMessageComponent;
  let fixture: ComponentFixture<TicketMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
