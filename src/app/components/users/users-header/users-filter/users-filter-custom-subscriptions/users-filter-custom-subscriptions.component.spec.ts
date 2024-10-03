import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterCustomSubscriptionsComponent } from './users-filter-custom-subscriptions.component';

describe('UsersFilterCustomSubscriptionsComponent', () => {
  let component: UsersFilterCustomSubscriptionsComponent;
  let fixture: ComponentFixture<UsersFilterCustomSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterCustomSubscriptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterCustomSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
