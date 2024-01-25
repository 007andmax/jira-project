import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToCompanyComponent } from './add-user-to-company.component';

describe('AddUserToCompanyComponent', () => {
  let component: AddUserToCompanyComponent;
  let fixture: ComponentFixture<AddUserToCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserToCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
