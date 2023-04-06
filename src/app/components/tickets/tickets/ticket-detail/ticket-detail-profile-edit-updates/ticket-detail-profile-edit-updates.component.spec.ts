import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileEditUpdatesComponent } from './ticket-detail-profile-edit-updates.component';

describe('TicketDetailProfileEditUpdatesComponent', () => {
  let component: TicketDetailProfileEditUpdatesComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileEditUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
