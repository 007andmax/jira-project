import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAllCustomerCompanyComponent } from './file-management-all-customer-company.component';

describe('FileManagementAllCustomerCompanyComponent', () => {
  let component: FileManagementAllCustomerCompanyComponent;
  let fixture: ComponentFixture<FileManagementAllCustomerCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAllCustomerCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAllCustomerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
