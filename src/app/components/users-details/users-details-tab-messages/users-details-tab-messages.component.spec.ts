import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabMessagesComponent } from './users-details-tab-messages.component';

describe('UsersDetailsTabMessagesComponent', () => {
  let component: UsersDetailsTabMessagesComponent;
  let fixture: ComponentFixture<UsersDetailsTabMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
