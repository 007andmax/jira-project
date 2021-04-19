import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsAsideBlockTimeBillingPreviewComponent } from './contracts-aside-block-time-billing-preview.component';

describe('ContractsAsideBlockTimeBillingPreviewComponent', () => {
  let component: ContractsAsideBlockTimeBillingPreviewComponent;
  let fixture: ComponentFixture<ContractsAsideBlockTimeBillingPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractsAsideBlockTimeBillingPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsAsideBlockTimeBillingPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
