import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerAllCustomerComponent } from './file-manager-all-customer.component';

describe('FileManagerAllCustomerComponent', () => {
  let component: FileManagerAllCustomerComponent;
  let fixture: ComponentFixture<FileManagerAllCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerAllCustomerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerAllCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
