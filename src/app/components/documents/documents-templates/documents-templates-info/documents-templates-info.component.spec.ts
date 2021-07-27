import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTemplatesInfoComponent } from './documents-templates-info.component';

describe('DocumentsTemplatesInfoComponent', () => {
  let component: DocumentsTemplatesInfoComponent;
  let fixture: ComponentFixture<DocumentsTemplatesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsTemplatesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTemplatesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
