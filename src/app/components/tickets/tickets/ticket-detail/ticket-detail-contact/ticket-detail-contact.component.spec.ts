import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailContactComponent } from './ticket-detail-contact.component';

describe('TicketDetailContactComponent', () => {
  let component: TicketDetailContactComponent;
  let fixture: ComponentFixture<TicketDetailContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
