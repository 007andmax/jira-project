import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditCategoryComponent } from './documents-edit-category.component';

describe('DocumentsEditCategoryComponent', () => {
  let component: DocumentsEditCategoryComponent;
  let fixture: ComponentFixture<DocumentsEditCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
