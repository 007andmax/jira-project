import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesCheckUseComponent } from './subscription-services-check-use.component';

describe('SubscriptionServicesCheckUseComponent', () => {
  let component: SubscriptionServicesCheckUseComponent;
  let fixture: ComponentFixture<SubscriptionServicesCheckUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesCheckUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesCheckUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
