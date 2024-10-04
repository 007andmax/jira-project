import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFileManagerCategoryComponent } from './company-file-manager-category.component';

describe('CompanyFileManagerCategoryComponent', () => {
  let component: CompanyFileManagerCategoryComponent;
  let fixture: ComponentFixture<CompanyFileManagerCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFileManagerCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFileManagerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
