import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractCompanyDropDownComponent } from './contract-company-drop-down.component';

describe('ContractCompanyDropDownComponent', () => {
  let component: ContractCompanyDropDownComponent;
  let fixture: ComponentFixture<ContractCompanyDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractCompanyDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractCompanyDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
