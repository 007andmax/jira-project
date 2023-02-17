import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileEditUpdatesServicesComponent } from './ticket-detail-profile-edit-updates-services.component';

describe('TicketDetailProfileEditUpdatesServicesComponent', () => {
  let component: TicketDetailProfileEditUpdatesServicesComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileEditUpdatesServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
