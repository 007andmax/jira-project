import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSubscriptionsAsideItemInfoComponent } from './marketing-subscriptions-aside-item-info.component';

describe('MarketingSubscriptionsAsideItemInfoComponent', () => {
  let component: MarketingSubscriptionsAsideItemInfoComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAsideItemInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSubscriptionsAsideItemInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSubscriptionsAsideItemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
