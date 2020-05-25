import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketProfileUpdatesServiceDurationComponent } from './ticket-profile-updates-service-duration.component';

describe('TicketProfileUpdatesServiceDurationComponent', () => {
  let component: TicketProfileUpdatesServiceDurationComponent;
  let fixture: ComponentFixture<TicketProfileUpdatesServiceDurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketProfileUpdatesServiceDurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketProfileUpdatesServiceDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
