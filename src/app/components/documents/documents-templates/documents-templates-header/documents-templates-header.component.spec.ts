import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTemplatesHeaderComponent } from './documents-templates-header.component';

describe('DocumentsTemplatesHeaderComponent', () => {
  let component: DocumentsTemplatesHeaderComponent;
  let fixture: ComponentFixture<DocumentsTemplatesHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsTemplatesHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTemplatesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
