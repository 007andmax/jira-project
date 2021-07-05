import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditComponent } from './documents-edit.component';

describe('DocumentsEditComponent', () => {
  let component: DocumentsEditComponent;
  let fixture: ComponentFixture<DocumentsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
