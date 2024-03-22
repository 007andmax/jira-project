import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSubscriptionsAsideComponent } from './marketing-subscriptions-aside.component';

describe('MarketingSubscriptionsAsideComponent', () => {
  let component: MarketingSubscriptionsAsideComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSubscriptionsAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSubscriptionsAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
