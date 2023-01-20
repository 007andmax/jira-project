import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailProfileUpdatesServiceEditComponent } from './ticket-detail-profile-updates-service-edit.component';

describe('TicketDetailProfileUpdatesServiceEditComponent', () => {
  let component: TicketDetailProfileUpdatesServiceEditComponent;
  let fixture: ComponentFixture<TicketDetailProfileUpdatesServiceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailProfileUpdatesServiceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailProfileUpdatesServiceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
