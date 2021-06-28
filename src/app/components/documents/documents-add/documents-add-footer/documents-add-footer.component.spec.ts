import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddFooterComponent } from './documents-add-footer.component';

describe('DocumentsAddFooterComponent', () => {
  let component: DocumentsAddFooterComponent;
  let fixture: ComponentFixture<DocumentsAddFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
