import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileEditUpdatesHeaderComponent } from './ticket-detail-profile-edit-updates-header.component';

describe('TicketDetailProfileEditUpdatesHeaderComponent', () => {
  let component: TicketDetailProfileEditUpdatesHeaderComponent;
  let fixture: ComponentFixture<TicketDetailProfileEditUpdatesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileEditUpdatesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileEditUpdatesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
