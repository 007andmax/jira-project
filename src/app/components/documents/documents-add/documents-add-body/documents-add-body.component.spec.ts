import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddBodyComponent } from './documents-add-body.component';

describe('DocumentsAddBodyComponent', () => {
  let component: DocumentsAddBodyComponent;
  let fixture: ComponentFixture<DocumentsAddBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
