import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemAssignedUserComponent } from './tickets-table-item-assigned-user.component';

describe('TicketsTableItemAssignedUserComponent', () => {
  let component: TicketsTableItemAssignedUserComponent;
  let fixture: ComponentFixture<TicketsTableItemAssignedUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableItemAssignedUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTableItemAssignedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
