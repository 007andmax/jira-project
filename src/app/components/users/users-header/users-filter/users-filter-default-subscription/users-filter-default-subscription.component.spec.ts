import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersFilterDefaultSubscriptionComponent } from './users-filter-default-subscription.component';

describe('UsersFilterDefaultSubscriptionComponent', () => {
  let component: UsersFilterDefaultSubscriptionComponent;
  let fixture: ComponentFixture<UsersFilterDefaultSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersFilterDefaultSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersFilterDefaultSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
