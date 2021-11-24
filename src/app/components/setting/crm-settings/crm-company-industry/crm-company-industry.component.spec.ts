import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCompanyIndustryComponent } from './crm-company-industry.component';

describe('CrmCompanyIndustryComponent', () => {
  let component: CrmCompanyIndustryComponent;
  let fixture: ComponentFixture<CrmCompanyIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmCompanyIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCompanyIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
