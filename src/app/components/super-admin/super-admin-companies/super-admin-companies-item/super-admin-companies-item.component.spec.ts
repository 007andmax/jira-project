import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminCompaniesItemComponent } from './super-admin-companies-item.component';

describe('SuperAdminCompaniesItemComponent', () => {
  let component: SuperAdminCompaniesItemComponent;
  let fixture: ComponentFixture<SuperAdminCompaniesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminCompaniesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminCompaniesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
