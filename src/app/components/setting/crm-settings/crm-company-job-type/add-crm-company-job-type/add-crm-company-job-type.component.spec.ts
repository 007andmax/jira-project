import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmCompanyJobTypeComponent } from './add-crm-company-job-type.component';

describe('AddCrmCompanyJobTypeComponent', () => {
  let component: AddCrmCompanyJobTypeComponent;
  let fixture: ComponentFixture<AddCrmCompanyJobTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmCompanyJobTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmCompanyJobTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
