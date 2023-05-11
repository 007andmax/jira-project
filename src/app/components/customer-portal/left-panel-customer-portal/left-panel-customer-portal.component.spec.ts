import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelCustomerPortalComponent } from './left-panel-customer-portal.component';

describe('LeftPanelCustomerPortalComponent', () => {
  let component: LeftPanelCustomerPortalComponent;
  let fixture: ComponentFixture<LeftPanelCustomerPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelCustomerPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelCustomerPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
