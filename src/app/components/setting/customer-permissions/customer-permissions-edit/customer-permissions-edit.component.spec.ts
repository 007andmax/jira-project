import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPermissionsEditComponent } from './customer-permissions-edit.component';

describe('CustomerPermissionsEditComponent', () => {
  let component: CustomerPermissionsEditComponent;
  let fixture: ComponentFixture<CustomerPermissionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPermissionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPermissionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
