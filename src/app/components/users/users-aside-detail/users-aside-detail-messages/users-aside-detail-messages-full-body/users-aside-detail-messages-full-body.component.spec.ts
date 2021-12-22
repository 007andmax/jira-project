import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailMessagesFullBodyComponent } from './users-aside-detail-messages-full-body.component';

describe('UsersAsideDetailMessagesFullBodyComponent', () => {
  let component: UsersAsideDetailMessagesFullBodyComponent;
  let fixture: ComponentFixture<UsersAsideDetailMessagesFullBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailMessagesFullBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailMessagesFullBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
