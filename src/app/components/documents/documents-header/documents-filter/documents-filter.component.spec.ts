import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsFilterComponent } from './documents-filter.component';

describe('DocumentsFilterComponent', () => {
  let component: DocumentsFilterComponent;
  let fixture: ComponentFixture<DocumentsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
