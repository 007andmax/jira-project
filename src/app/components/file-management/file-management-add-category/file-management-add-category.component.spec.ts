import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementAddCategoryComponent } from './file-management-add-category.component';

describe('FileManagementAddCategoryComponent', () => {
  let component: FileManagementAddCategoryComponent;
  let fixture: ComponentFixture<FileManagementAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementAddCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
