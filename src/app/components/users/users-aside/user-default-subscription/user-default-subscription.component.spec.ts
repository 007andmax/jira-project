import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDefaultSubscriptionComponent } from './user-default-subscription.component';

describe('UserDefaultSubscriptionComponent', () => {
  let component: UserDefaultSubscriptionComponent;
  let fixture: ComponentFixture<UserDefaultSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDefaultSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDefaultSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
