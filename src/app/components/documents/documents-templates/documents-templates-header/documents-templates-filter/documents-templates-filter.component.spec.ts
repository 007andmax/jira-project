import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTemplatesFilterComponent } from './documents-templates-filter.component';

describe('DocumentsTemplatesFilterComponent', () => {
  let component: DocumentsTemplatesFilterComponent;
  let fixture: ComponentFixture<DocumentsTemplatesFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsTemplatesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTemplatesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
