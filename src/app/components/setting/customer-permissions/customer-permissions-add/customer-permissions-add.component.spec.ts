import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPermissionsAddComponent } from './customer-permissions-add.component';

describe('CustomerPermissionsAddComponent', () => {
  let component: CustomerPermissionsAddComponent;
  let fixture: ComponentFixture<CustomerPermissionsAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPermissionsAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPermissionsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
