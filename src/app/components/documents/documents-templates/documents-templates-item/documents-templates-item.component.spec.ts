import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsTemplatesItemComponent } from './documents-templates-item.component';

describe('DocumentsTemplatesItemComponent', () => {
  let component: DocumentsTemplatesItemComponent;
  let fixture: ComponentFixture<DocumentsTemplatesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsTemplatesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsTemplatesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
