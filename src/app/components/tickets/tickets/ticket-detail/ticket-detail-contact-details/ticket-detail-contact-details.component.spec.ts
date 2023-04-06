import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailContactDetailsComponent } from './ticket-detail-contact-details.component';

describe('TicketDetailContactDetailsComponent', () => {
  let component: TicketDetailContactDetailsComponent;
  let fixture: ComponentFixture<TicketDetailContactDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailContactDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
