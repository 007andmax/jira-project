import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemAssignedUserMoreItemComponent } from './tickets-table-item-assigned-user-more-item.component';

describe('TicketsTableItemAssignedUserMoreItemComponent', () => {
  let component: TicketsTableItemAssignedUserMoreItemComponent;
  let fixture: ComponentFixture<TicketsTableItemAssignedUserMoreItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableItemAssignedUserMoreItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTableItemAssignedUserMoreItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
