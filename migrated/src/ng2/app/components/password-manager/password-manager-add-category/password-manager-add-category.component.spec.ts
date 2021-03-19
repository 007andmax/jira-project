import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordManagerAddCategoryComponent } from './password-manager-add-category.component';

describe('PasswordManagerAddCategoryComponent', () => {
  let component: PasswordManagerAddCategoryComponent;
  let fixture: ComponentFixture<PasswordManagerAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordManagerAddCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordManagerAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
