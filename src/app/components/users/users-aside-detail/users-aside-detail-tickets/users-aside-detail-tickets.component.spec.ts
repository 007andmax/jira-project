import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailTicketsComponent } from './users-aside-detail-tickets.component';

describe('UsersAsideDetailTicketsComponent', () => {
  let component: UsersAsideDetailTicketsComponent;
  let fixture: ComponentFixture<UsersAsideDetailTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
