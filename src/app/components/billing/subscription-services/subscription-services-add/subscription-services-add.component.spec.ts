import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionServicesAddComponent } from './subscription-services-add.component';

describe('SubscriptionServicesAddComponent', () => {
  let component: SubscriptionServicesAddComponent;
  let fixture: ComponentFixture<SubscriptionServicesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriptionServicesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionServicesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
