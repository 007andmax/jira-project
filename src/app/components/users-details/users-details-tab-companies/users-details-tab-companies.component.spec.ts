import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabCompaniesComponent } from './users-details-tab-companies.component';

describe('UsersDetailsTabCompaniesComponent', () => {
  let component: UsersDetailsTabCompaniesComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabCompaniesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
