import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesEditComponent } from './subscription-services-edit.component';

describe('SubscriptionServicesEditComponent', () => {
  let component: SubscriptionServicesEditComponent;
  let fixture: ComponentFixture<SubscriptionServicesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
