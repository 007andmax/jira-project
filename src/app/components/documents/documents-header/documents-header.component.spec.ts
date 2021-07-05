import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsHeaderComponent } from './documents-header.component';

describe('DocumentsHeaderComponent', () => {
  let component: DocumentsHeaderComponent;
  let fixture: ComponentFixture<DocumentsHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
