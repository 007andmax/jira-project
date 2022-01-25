import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCustomSubscriptionComponent } from './user-custom-subscription.component';

describe('UserCustomSubscriptionComponent', () => {
  let component: UserCustomSubscriptionComponent;
  let fixture: ComponentFixture<UserCustomSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCustomSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCustomSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
