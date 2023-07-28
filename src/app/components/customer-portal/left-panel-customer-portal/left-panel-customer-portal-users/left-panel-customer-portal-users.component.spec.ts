import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelCustomerPortalUsersComponent } from './left-panel-customer-portal-users.component';

describe('LeftPanelCustomerPortalUsersComponent', () => {
  let component: LeftPanelCustomerPortalUsersComponent;
  let fixture: ComponentFixture<LeftPanelCustomerPortalUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelCustomerPortalUsersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelCustomerPortalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
