import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPermissionsRemoveRoleComponent } from './customer-permissions-remove-role.component';

describe('CustomerPermissionsRemoveRoleComponent', () => {
  let component: CustomerPermissionsRemoveRoleComponent;
  let fixture: ComponentFixture<CustomerPermissionsRemoveRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPermissionsRemoveRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPermissionsRemoveRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
