import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagementCategoryComponent } from './file-management-category.component';

describe('FileManagementCategoryComponent', () => {
  let component: FileManagementCategoryComponent;
  let fixture: ComponentFixture<FileManagementCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileManagementCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagementCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
