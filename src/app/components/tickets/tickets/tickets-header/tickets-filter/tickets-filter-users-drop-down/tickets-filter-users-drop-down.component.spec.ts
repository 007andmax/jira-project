import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFilterUsersDropDownComponent } from './tickets-filter-users-drop-down.component';

describe('TicketsFilterUsersDropDownComponent', () => {
  let component: TicketsFilterUsersDropDownComponent;
  let fixture: ComponentFixture<TicketsFilterUsersDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TicketsFilterUsersDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFilterUsersDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
