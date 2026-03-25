import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableCompanyInfoItemComponent } from './users-table-company-info-item.component';

describe('UsersTableCompanyInfoItemComponent', () => {
  let component: UsersTableCompanyInfoItemComponent;
  let fixture: ComponentFixture<UsersTableCompanyInfoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTableCompanyInfoItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTableCompanyInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
