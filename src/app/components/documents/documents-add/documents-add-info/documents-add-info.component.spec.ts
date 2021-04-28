import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsAddInfoComponent } from './documents-add-info.component';

describe('DocumentsAddInfoComponent', () => {
  let component: DocumentsAddInfoComponent;
  let fixture: ComponentFixture<DocumentsAddInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsAddInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsAddInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
