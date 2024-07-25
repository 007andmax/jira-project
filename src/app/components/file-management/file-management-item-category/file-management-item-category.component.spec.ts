import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementItemCategoryComponent } from './file-management-item-category.component';

describe('FileManagementItemCategoryComponent', () => {
  let component: FileManagementItemCategoryComponent;
  let fixture: ComponentFixture<FileManagementItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementItemCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
