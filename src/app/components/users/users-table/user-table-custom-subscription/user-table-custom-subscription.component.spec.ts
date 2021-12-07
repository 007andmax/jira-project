import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTableCustomSubscriptionComponent } from './user-table-custom-subscription.component';

describe('UserTableCustomSubscriptionComponent', () => {
  let component: UserTableCustomSubscriptionComponent;
  let fixture: ComponentFixture<UserTableCustomSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTableCustomSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableCustomSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
