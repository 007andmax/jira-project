import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesConfirmComponent } from './subscription-services-confirm.component';

describe('SubscriptionServicesConfirmComponent', () => {
  let component: SubscriptionServicesConfirmComponent;
  let fixture: ComponentFixture<SubscriptionServicesConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
