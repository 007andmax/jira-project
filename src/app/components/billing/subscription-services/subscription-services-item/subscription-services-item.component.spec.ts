import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesItemComponent } from './subscription-services-item.component';

describe('SubscriptionServicesItemComponent', () => {
  let component: SubscriptionServicesItemComponent;
  let fixture: ComponentFixture<SubscriptionServicesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
