import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerPortalDefaultComponent } from './customer-portal-default.component';

describe('CustomerPortalDefaultComponent', () => {
  let component: CustomerPortalDefaultComponent;
  let fixture: ComponentFixture<CustomerPortalDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerPortalDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPortalDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
