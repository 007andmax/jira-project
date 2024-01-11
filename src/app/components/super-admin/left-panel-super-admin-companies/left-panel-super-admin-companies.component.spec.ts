import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSuperAdminCompaniesComponent } from './left-panel-super-admin-companies.component';

describe('LeftPanelSuperAdminCompaniesComponent', () => {
  let component: LeftPanelSuperAdminCompaniesComponent;
  let fixture: ComponentFixture<LeftPanelSuperAdminCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSuperAdminCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSuperAdminCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
