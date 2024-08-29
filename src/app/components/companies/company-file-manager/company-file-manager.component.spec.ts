import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyFileManagerComponent } from './company-file-manager.component';

describe('CompanyFileManagerComponent', () => {
  let component: CompanyFileManagerComponent;
  let fixture: ComponentFixture<CompanyFileManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFileManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFileManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
