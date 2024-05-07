import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeArchiveNotificationComponent } from './user-de-archive-notification.component';

describe('UserDeArchiveNotificationComponent', () => {
  let component: UserDeArchiveNotificationComponent;
  let fixture: ComponentFixture<UserDeArchiveNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeArchiveNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeArchiveNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
