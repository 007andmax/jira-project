import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAsideDetailCompanyInfoComponent } from './users-aside-detail-company-info.component';

describe('UsersAsideDetailCompanyInfoComponent', () => {
  let component: UsersAsideDetailCompanyInfoComponent;
  let fixture: ComponentFixture<UsersAsideDetailCompanyInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersAsideDetailCompanyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAsideDetailCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
