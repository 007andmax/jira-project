import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableSubscriptionComponent } from './user-table-subscription.component';

describe('UserTableSubscriptionComponent', () => {
  let component: UserTableSubscriptionComponent;
  let fixture: ComponentFixture<UserTableSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTableSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
