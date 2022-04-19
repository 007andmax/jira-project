import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageEditCategoryComponent } from './support-page-edit-category.component';

describe('SupportPageEditCategoryComponent', () => {
  let component: SupportPageEditCategoryComponent;
  let fixture: ComponentFixture<SupportPageEditCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageEditCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageEditCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
