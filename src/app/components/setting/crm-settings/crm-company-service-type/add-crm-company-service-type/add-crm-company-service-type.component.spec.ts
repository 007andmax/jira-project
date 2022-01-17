import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmCompanyServiceTypeComponent } from './add-crm-company-service-type.component';

describe('AddCrmCompanyServiceTypeComponent', () => {
  let component: AddCrmCompanyServiceTypeComponent;
  let fixture: ComponentFixture<AddCrmCompanyServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmCompanyServiceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmCompanyServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
