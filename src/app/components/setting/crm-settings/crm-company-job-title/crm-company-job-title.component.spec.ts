import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCompanyJobTitleComponent } from './crm-company-job-title.component';

describe('CrmCompanyJobTitleComponent', () => {
  let component: CrmCompanyJobTitleComponent;
  let fixture: ComponentFixture<CrmCompanyJobTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmCompanyJobTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCompanyJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
