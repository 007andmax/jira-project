import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesComponent } from './subscription-services.component';

describe('SubscriptionServicesComponent', () => {
  let component: SubscriptionServicesComponent;
  let fixture: ComponentFixture<SubscriptionServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
