import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditInfoComponent } from './documents-edit-info.component';

describe('DocumentsEditInfoComponent', () => {
  let component: DocumentsEditInfoComponent;
  let fixture: ComponentFixture<DocumentsEditInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
