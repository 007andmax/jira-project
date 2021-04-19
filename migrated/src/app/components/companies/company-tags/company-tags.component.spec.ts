import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyTagsComponent } from './company-tags.component';

describe('CompanyTagsComponent', () => {
  let component: CompanyTagsComponent;
  let fixture: ComponentFixture<CompanyTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
