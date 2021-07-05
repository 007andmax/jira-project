import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsCategoryComponent } from './documents-category.component';

describe('DocumentsCategoryComponent', () => {
  let component: DocumentsCategoryComponent;
  let fixture: ComponentFixture<DocumentsCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
