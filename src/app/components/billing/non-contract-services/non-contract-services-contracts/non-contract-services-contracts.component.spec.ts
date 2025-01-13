import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonContractServicesContractsComponent } from './non-contract-services-contracts.component';

describe('NonContractServicesContractsComponent', () => {
  let component: NonContractServicesContractsComponent;
  let fixture: ComponentFixture<NonContractServicesContractsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NonContractServicesContractsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonContractServicesContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
