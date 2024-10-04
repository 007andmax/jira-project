import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerAllCustomerCompanyComponent } from './file-manager-all-customer-company.component';

describe('FileManagerAllCustomerCompanyComponent', () => {
  let component: FileManagerAllCustomerCompanyComponent;
  let fixture: ComponentFixture<FileManagerAllCustomerCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerAllCustomerCompanyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerAllCustomerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
