import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesHeaderInfoComponent } from './ticket-detail-profile-updates-header-info.component';

describe('TicketDetailProfileUpdatesHeaderInfoComponent', () => {
  let component: TicketDetailProfileUpdatesHeaderInfoComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesHeaderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesHeaderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesHeaderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
