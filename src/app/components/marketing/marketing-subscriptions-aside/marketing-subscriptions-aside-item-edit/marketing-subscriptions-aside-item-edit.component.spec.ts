import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingSubscriptionsAsideItemEditComponent } from './marketing-subscriptions-aside-item-edit.component';

describe('MarketingSubscriptionsAsideItemEditComponent', () => {
  let component: MarketingSubscriptionsAsideItemEditComponent;
  let fixture: ComponentFixture<MarketingSubscriptionsAsideItemEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingSubscriptionsAsideItemEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingSubscriptionsAsideItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
