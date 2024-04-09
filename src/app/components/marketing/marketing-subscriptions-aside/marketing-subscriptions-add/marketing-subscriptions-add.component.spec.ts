import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSubscriptionsAddComponent } from './marketing-subscriptions-add.component';

describe('MarketingSubscriptionsAddComponent', () => {
  let component: MarketingSubscriptionsAddComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSubscriptionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSubscriptionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
