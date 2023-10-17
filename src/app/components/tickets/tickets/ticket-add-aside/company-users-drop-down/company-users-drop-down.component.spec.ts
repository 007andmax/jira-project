import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyUsersDropDownComponent } from './company-users-drop-down.component';

describe('CompanyUsersDropDownComponent', () => {
  let component: CompanyUsersDropDownComponent;
  let fixture: ComponentFixture<CompanyUsersDropDownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyUsersDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUsersDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
