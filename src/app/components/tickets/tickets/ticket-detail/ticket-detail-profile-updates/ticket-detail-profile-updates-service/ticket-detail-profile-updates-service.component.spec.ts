import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesServiceComponent } from './ticket-detail-profile-updates-service.component';

describe('TicketDetailProfileUpdatesServiceComponent', () => {
  let component: TicketDetailProfileUpdatesServiceComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
