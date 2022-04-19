import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageAddSubCategoryComponent } from './support-page-add-sub-category.component';

describe('SupportPageAddSubCategoryComponent', () => {
  let component: SupportPageAddSubCategoryComponent;
  let fixture: ComponentFixture<SupportPageAddSubCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageAddSubCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageAddSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
