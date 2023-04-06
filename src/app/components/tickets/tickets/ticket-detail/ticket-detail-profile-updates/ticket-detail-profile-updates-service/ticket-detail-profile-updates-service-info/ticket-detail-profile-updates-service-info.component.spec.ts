import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesServiceInfoComponent } from './ticket-detail-profile-updates-service-info.component';

describe('TicketDetailProfileUpdatesServiceInfoComponent', () => {
  let component: TicketDetailProfileUpdatesServiceInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesServiceInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
