import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesServiceItemComponent } from './ticket-detail-profile-updates-service-item.component';

describe('TicketDetailProfileUpdatesServiceItemComponent', () => {
  let component: TicketDetailProfileUpdatesServiceItemComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesServiceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
