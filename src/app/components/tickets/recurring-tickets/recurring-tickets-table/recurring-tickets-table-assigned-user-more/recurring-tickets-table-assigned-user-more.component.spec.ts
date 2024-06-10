import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringTicketsTableAssignedUserMoreComponent } from './recurring-tickets-table-assigned-user-more.component';

describe('RecurringTicketsTableAssignedUserMoreComponent', () => {
  let component: RecurringTicketsTableAssignedUserMoreComponent;
  let fixture: ComponentFixture<RecurringTicketsTableAssignedUserMoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecurringTicketsTableAssignedUserMoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringTicketsTableAssignedUserMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
