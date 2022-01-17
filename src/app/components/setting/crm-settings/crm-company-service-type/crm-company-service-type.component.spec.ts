import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmCompanyServiceTypeComponent } from './crm-company-service-type.component';

describe('CrmCompanyServiceTypeComponent', () => {
  let component: CrmCompanyServiceTypeComponent;
  let fixture: ComponentFixture<CrmCompanyServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmCompanyServiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmCompanyServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
