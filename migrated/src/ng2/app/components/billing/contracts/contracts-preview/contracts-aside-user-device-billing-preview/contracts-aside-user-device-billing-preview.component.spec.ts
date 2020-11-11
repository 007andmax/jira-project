import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideUserDeviceBillingPreviewComponent } from './contracts-aside-user-device-billing-preview.component';

describe('ContractsAsideUserDeviceBillingPreviewComponent', () => {
  let component: ContractsAsideUserDeviceBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideUserDeviceBillingPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideUserDeviceBillingPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideUserDeviceBillingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
