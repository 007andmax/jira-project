import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDashContractComponent } from './company-dash-contract.component';

describe('CompanyDashContractComponent', () => {
  let component: CompanyDashContractComponent;
  let fixture: ComponentFixture<CompanyDashContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDashContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDashContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
