import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsLinkedComponent } from './documents-linked.component';

describe('DocumentsLinkedComponent', () => {
  let component: DocumentsLinkedComponent;
  let fixture: ComponentFixture<DocumentsLinkedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsLinkedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsLinkedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
