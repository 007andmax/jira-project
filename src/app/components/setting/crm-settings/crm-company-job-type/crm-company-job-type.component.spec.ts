import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCompanyJobTypeComponent } from './crm-company-job-type.component';

describe('CrmCompanyJobTypeComponent', () => {
  let component: CrmCompanyJobTypeComponent;
  let fixture: ComponentFixture<CrmCompanyJobTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmCompanyJobTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCompanyJobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
