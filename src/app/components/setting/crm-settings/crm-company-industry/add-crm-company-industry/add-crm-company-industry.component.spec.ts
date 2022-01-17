import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmCompanyIndustryComponent } from './add-crm-company-industry.component';

describe('AddCrmCompanyIndustryComponent', () => {
  let component: AddCrmCompanyIndustryComponent;
  let fixture: ComponentFixture<AddCrmCompanyIndustryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmCompanyIndustryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmCompanyIndustryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
