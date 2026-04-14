import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTableCompanyByComponent } from './users-table-company-by.component';

describe('UsersTableCompanyByComponent', () => {
  let component: UsersTableCompanyByComponent;
  let fixture: ComponentFixture<UsersTableCompanyByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTableCompanyByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTableCompanyByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
