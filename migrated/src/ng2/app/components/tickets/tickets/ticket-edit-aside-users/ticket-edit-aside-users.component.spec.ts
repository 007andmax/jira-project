import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketEditAsideUsersComponent } from './ticket-edit-aside-users.component';

describe('TicketEditAsideUsersComponent', () => {
  let component: TicketEditAsideUsersComponent;
  let fixture: ComponentFixture<TicketEditAsideUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketEditAsideUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketEditAsideUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
