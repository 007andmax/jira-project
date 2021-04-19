import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideHourlyBillingPreviewComponent } from './contracts-aside-hourly-billing-preview.component';

describe('ContractsAsideHourlyBillingPreviewComponent', () => {
  let component: ContractsAsideHourlyBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideHourlyBillingPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideHourlyBillingPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideHourlyBillingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
