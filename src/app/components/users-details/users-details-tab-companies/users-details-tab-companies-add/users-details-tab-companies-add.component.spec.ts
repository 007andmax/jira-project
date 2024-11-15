import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabCompaniesAddComponent } from './users-details-tab-companies-add.component';

describe('UsersDetailsTabCompaniesAddComponent', () => {
  let component: UsersDetailsTabCompaniesAddComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabCompaniesAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabCompaniesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
