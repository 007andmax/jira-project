import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsFilterTagsComponent } from './documents-filter-tags.component';

describe('DocumentsFilterTagsComponent', () => {
  let component: DocumentsFilterTagsComponent;
  let fixture: ComponentFixture<DocumentsFilterTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsFilterTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsFilterTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
