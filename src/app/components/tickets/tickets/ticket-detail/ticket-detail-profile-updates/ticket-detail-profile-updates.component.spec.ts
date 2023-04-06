import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesComponent } from './ticket-detail-profile-updates.component';

describe('TicketDetailProfileUpdatesComponent', () => {
  let component: TicketDetailProfileUpdatesComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
