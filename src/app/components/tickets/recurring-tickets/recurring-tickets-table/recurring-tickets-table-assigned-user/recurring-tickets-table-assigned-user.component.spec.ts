import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTicketsTableAssignedUserComponent } from './recurring-tickets-table-assigned-user.component';

describe('RecurringTicketsTableAssignedUserComponent', () => {
  let component: RecurringTicketsTableAssignedUserComponent;
  let fixture: ComponentFixture<RecurringTicketsTableAssignedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringTicketsTableAssignedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringTicketsTableAssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
