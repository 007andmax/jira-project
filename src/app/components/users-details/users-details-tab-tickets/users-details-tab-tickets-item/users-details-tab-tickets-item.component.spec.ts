import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabTicketsItemComponent } from './users-details-tab-tickets-item.component';

describe('UsersDetailsTabTicketsItemComponent', () => {
  let component: UsersDetailsTabTicketsItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabTicketsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabTicketsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabTicketsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
