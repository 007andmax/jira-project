import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketingSubscriptionTypeComponent } from './add-marketing-subscription-type.component';

describe('AddMarketingSubscriptionTypeComponent', () => {
  let component: AddMarketingSubscriptionTypeComponent;
  let fixture: ComponentFixture<AddMarketingSubscriptionTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarketingSubscriptionTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketingSubscriptionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
