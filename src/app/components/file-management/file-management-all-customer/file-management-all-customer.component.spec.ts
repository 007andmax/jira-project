import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAllCustomerComponent } from './file-management-all-customer.component';

describe('FileManagementAllCustomerComponent', () => {
  let component: FileManagementAllCustomerComponent;
  let fixture: ComponentFixture<FileManagementAllCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAllCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAllCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
