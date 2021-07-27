import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddEditCategoriesComponent } from './documents-add-edit-categories.component';

describe('DocumentsAddEditCategoriesComponent', () => {
  let component: DocumentsAddEditCategoriesComponent;
  let fixture: ComponentFixture<DocumentsAddEditCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddEditCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddEditCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
