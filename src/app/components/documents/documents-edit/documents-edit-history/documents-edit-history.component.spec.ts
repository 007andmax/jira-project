import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsEditHistoryComponent } from './documents-edit-history.component';

describe('DocumentsEditHistoryComponent', () => {
  let component: DocumentsEditHistoryComponent;
  let fixture: ComponentFixture<DocumentsEditHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsEditHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsEditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
