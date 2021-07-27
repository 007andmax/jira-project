import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddHeaderComponent } from './documents-add-header.component';

describe('DocumentsAddHeaderComponent', () => {
  let component: DocumentsAddHeaderComponent;
  let fixture: ComponentFixture<DocumentsAddHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
