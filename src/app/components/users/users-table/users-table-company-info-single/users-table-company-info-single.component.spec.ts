import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableCompanyInfoSingleComponent } from './users-table-company-info-single.component';

describe('UsersTableCompanyInfoSingleComponent', () => {
  let component: UsersTableCompanyInfoSingleComponent;
  let fixture: ComponentFixture<UsersTableCompanyInfoSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTableCompanyInfoSingleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTableCompanyInfoSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
