import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindWithinDocumentComponent } from './find-within-document.component';

describe('FindWithinDocumentComponent', () => {
  let component: FindWithinDocumentComponent;
  let fixture: ComponentFixture<FindWithinDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindWithinDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindWithinDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
