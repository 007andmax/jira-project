import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailMessagesComponent } from './users-aside-detail-messages.component';

describe('UsersAsideDetailMessagesComponent', () => {
  let component: UsersAsideDetailMessagesComponent;
  let fixture: ComponentFixture<UsersAsideDetailMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
