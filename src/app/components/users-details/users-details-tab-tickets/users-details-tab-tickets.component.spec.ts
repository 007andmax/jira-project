import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabTicketsComponent } from './users-details-tab-tickets.component';

describe('UsersDetailsTabTicketsComponent', () => {
  let component: UsersDetailsTabTicketsComponent;
  let fixture: ComponentFixture<UsersDetailsTabTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
