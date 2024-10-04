import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedTicketUserComponent } from './assigned-ticket-user.component';

describe('AssignedTicketUserComponent', () => {
  let component: AssignedTicketUserComponent;
  let fixture: ComponentFixture<AssignedTicketUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignedTicketUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignedTicketUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
