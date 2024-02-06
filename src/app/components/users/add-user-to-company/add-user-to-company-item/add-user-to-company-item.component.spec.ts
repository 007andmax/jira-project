import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToCompanyItemComponent } from './add-user-to-company-item.component';

describe('AddUserToCompanyItemComponent', () => {
  let component: AddUserToCompanyItemComponent;
  let fixture: ComponentFixture<AddUserToCompanyItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserToCompanyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToCompanyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
