import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesUsersDetailsComponent } from './companies-users-details.component';

describe('CompaniesUsersDetailsComponent', () => {
  let component: CompaniesUsersDetailsComponent;
  let fixture: ComponentFixture<CompaniesUsersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompaniesUsersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompaniesUsersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
