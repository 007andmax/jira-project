import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerCategoryRenameComponent } from './file-manager-category-rename.component';

describe('FileManagerCategoryRenameComponent', () => {
  let component: FileManagerCategoryRenameComponent;
  let fixture: ComponentFixture<FileManagerCategoryRenameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerCategoryRenameComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerCategoryRenameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
