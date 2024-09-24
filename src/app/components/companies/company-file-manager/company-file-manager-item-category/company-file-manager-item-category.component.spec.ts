import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFileManagerItemCategoryComponent } from './company-file-manager-item-category.component';

describe('CompanyFileManagerItemCategoryComponent', () => {
  let component: CompanyFileManagerItemCategoryComponent;
  let fixture: ComponentFixture<CompanyFileManagerItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFileManagerItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFileManagerItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
