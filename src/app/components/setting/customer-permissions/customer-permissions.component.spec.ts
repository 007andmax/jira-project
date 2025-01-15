import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPermissionsComponent } from './customer-permissions.component';

describe('CustomerPermissionsComponent', () => {
  let component: CustomerPermissionsComponent;
  let fixture: ComponentFixture<CustomerPermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPermissionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
