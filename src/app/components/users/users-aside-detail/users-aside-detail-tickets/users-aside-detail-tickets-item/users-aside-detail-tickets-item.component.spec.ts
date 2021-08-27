import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailTicketsItemComponent } from './users-aside-detail-tickets-item.component';

describe('UsersAsideDetailTicketsItemComponent', () => {
  let component: UsersAsideDetailTicketsItemComponent;
  let fixture: ComponentFixture<UsersAsideDetailTicketsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailTicketsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailTicketsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
