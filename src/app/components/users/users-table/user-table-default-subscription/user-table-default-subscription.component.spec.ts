import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableDefaultSubscriptionComponent } from './user-table-default-subscription.component';

describe('UserTableDefaultSubscriptionComponent', () => {
  let component: UserTableDefaultSubscriptionComponent;
  let fixture: ComponentFixture<UserTableDefaultSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTableDefaultSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableDefaultSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
