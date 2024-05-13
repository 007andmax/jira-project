import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTicketUserItemComponent } from './assigned-ticket-user-item.component';

describe('AssignedTicketUserItemComponent', () => {
  let component: AssignedTicketUserItemComponent;
  let fixture: ComponentFixture<AssignedTicketUserItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedTicketUserItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTicketUserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
