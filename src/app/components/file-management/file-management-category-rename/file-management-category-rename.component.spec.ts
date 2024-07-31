import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementCategoryRenameComponent } from './file-management-category-rename.component';

describe('FileManagementCategoryRenameComponent', () => {
  let component: FileManagementCategoryRenameComponent;
  let fixture: ComponentFixture<FileManagementCategoryRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementCategoryRenameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementCategoryRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
