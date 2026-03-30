import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsTableItemAssignedUserItemComponent } from './tickets-table-item-assigned-user-item.component';

describe('TicketsTableItemAssignedUserItemComponent', () => {
  let component: TicketsTableItemAssignedUserItemComponent;
  let fixture: ComponentFixture<TicketsTableItemAssignedUserItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsTableItemAssignedUserItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsTableItemAssignedUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
