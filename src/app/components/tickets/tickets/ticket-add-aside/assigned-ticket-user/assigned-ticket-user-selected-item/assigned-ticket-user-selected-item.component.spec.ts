import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTicketUserSelectedItemComponent } from './assigned-ticket-user-selected-item.component';

describe('AssignedTicketUserSelectedItemComponent', () => {
  let component: AssignedTicketUserSelectedItemComponent;
  let fixture: ComponentFixture<AssignedTicketUserSelectedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedTicketUserSelectedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTicketUserSelectedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
