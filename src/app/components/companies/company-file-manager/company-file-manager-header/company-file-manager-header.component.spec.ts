import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFileManagerHeaderComponent } from './company-file-manager-header.component';

describe('CompanyFileManagerHeaderComponent', () => {
  let component: CompanyFileManagerHeaderComponent;
  let fixture: ComponentFixture<CompanyFileManagerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFileManagerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFileManagerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
