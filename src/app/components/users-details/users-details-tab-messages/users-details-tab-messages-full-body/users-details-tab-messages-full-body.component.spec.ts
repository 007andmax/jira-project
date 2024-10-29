import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabMessagesFullBodyComponent } from './users-details-tab-messages-full-body.component';

describe('UsersDetailsTabMessagesFullBodyComponent', () => {
  let component: UsersDetailsTabMessagesFullBodyComponent;
  let fixture: ComponentFixture<UsersDetailsTabMessagesFullBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabMessagesFullBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabMessagesFullBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
