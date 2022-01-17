import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmCompanyJobTitleComponent } from './add-crm-company-job-title.component';

describe('AddCrmCompanyJobTitleComponent', () => {
  let component: AddCrmCompanyJobTitleComponent;
  let fixture: ComponentFixture<AddCrmCompanyJobTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmCompanyJobTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmCompanyJobTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
