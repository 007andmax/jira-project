import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerAddCategoryComponent } from './file-manager-add-category.component';

describe('FileManagerAddCategoryComponent', () => {
  let component: FileManagerAddCategoryComponent;
  let fixture: ComponentFixture<FileManagerAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerAddCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
