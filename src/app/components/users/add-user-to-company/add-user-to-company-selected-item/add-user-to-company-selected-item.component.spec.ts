import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserToCompanySelectedItemComponent } from './add-user-to-company-selected-item.component';

describe('AddUserToCompanySelectedItemComponent', () => {
  let component: AddUserToCompanySelectedItemComponent;
  let fixture: ComponentFixture<AddUserToCompanySelectedItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUserToCompanySelectedItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserToCompanySelectedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
