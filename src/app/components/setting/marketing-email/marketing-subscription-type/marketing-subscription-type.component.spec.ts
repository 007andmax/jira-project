import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSubscriptionTypeComponent } from './marketing-subscription-type.component';

describe('MarketingSubscriptionTypeComponent', () => {
  let component: MarketingSubscriptionTypeComponent;
  let fixture: ComponentFixture<MarketingSubscriptionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSubscriptionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSubscriptionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
