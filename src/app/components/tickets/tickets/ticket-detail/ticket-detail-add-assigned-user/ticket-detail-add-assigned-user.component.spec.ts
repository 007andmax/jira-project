import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailAddAssignedUserComponent } from './ticket-detail-add-assigned-user.component';

describe('TicketDetailAddAssignedUserComponent', () => {
  let component: TicketDetailAddAssignedUserComponent;
  let fixture: ComponentFixture<TicketDetailAddAssignedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketDetailAddAssignedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketDetailAddAssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
