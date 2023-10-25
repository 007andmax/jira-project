import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCompaniesHeaderComponent } from './super-admin-companies-header.component';

describe('SuperAdminCompaniesHeaderComponent', () => {
  let component: SuperAdminCompaniesHeaderComponent;
  let fixture: ComponentFixture<SuperAdminCompaniesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminCompaniesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCompaniesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
