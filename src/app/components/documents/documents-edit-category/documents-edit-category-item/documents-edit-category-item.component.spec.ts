import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditCategoryItemComponent } from './documents-edit-category-item.component';

describe('DocumentsEditCategoryItemComponent', () => {
  let component: DocumentsEditCategoryItemComponent;
  let fixture: ComponentFixture<DocumentsEditCategoryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditCategoryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditCategoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
