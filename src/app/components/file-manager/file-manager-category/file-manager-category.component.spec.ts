import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerCategoryComponent } from './file-manager-category.component';

describe('FileManagerCategoryComponent', () => {
  let component: FileManagerCategoryComponent;
  let fixture: ComponentFixture<FileManagerCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
