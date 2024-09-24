import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileManagerItemCategoryComponent } from './file-manager-item-category.component';

describe('FileManagerItemCategoryComponent', () => {
  let component: FileManagerItemCategoryComponent;
  let fixture: ComponentFixture<FileManagerItemCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileManagerItemCategoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileManagerItemCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
