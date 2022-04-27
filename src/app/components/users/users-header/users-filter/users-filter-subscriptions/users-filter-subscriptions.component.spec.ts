import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterSubscriptionsComponent } from './users-filter-subscriptions.component';

describe('UsersFilterSubscriptionsComponent', () => {
  let component: UsersFilterSubscriptionsComponent;
  let fixture: ComponentFixture<UsersFilterSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
