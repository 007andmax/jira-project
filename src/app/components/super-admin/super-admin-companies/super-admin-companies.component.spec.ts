import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCompaniesComponent } from './super-admin-companies.component';

describe('SuperAdminCompaniesComponent', () => {
  let component: SuperAdminCompaniesComponent;
  let fixture: ComponentFixture<SuperAdminCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
