import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailPasswordsDetailsComponent } from './ticket-detail-passwords-details.component';

describe('TicketDetailPasswordsDetailsComponent', () => {
  let component: TicketDetailPasswordsDetailsComponent;
  let fixture: ComponentFixture<TicketDetailPasswordsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailPasswordsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailPasswordsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
