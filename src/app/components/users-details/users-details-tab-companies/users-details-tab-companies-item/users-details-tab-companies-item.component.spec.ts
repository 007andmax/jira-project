import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDetailsTabCompaniesItemComponent } from './users-details-tab-companies-item.component';

describe('UsersDetailsTabCompaniesItemComponent', () => {
  let component: UsersDetailsTabCompaniesItemComponent;
  let fixture: ComponentFixture<UsersDetailsTabCompaniesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsersDetailsTabCompaniesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersDetailsTabCompaniesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
