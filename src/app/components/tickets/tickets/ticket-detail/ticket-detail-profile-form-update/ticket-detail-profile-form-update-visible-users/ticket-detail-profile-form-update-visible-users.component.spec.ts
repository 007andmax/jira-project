import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileFormUpdateVisibleUsersComponent } from './ticket-detail-profile-form-update-visible-users.component';

describe('TicketDetailProfileFormUpdateVisibleUsersComponent', () => {
  let component: TicketDetailProfileFormUpdateVisibleUsersComponent;
  let fixture: ComponentFixture<TicketDetailProfileFormUpdateVisibleUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileFormUpdateVisibleUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileFormUpdateVisibleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
