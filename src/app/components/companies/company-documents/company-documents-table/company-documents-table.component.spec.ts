import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDocumentsTableComponent } from './company-documents-table.component';

describe('CompanyDocumentsTableComponent', () => {
  let component: CompanyDocumentsTableComponent;
  let fixture: ComponentFixture<CompanyDocumentsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDocumentsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDocumentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
