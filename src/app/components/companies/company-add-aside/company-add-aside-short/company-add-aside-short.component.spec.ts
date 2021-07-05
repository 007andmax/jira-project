import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddAsideShortComponent } from './company-add-aside-short.component';

describe('CompanyAddAsideShortComponent', () => {
  let component: CompanyAddAsideShortComponent;
  let fixture: ComponentFixture<CompanyAddAsideShortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddAsideShortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddAsideShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
