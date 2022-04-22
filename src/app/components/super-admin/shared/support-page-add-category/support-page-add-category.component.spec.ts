import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageAddCategoryComponent } from './support-page-add-category.component';

describe('SupportPageAddCategoryComponent', () => {
  let component: SupportPageAddCategoryComponent;
  let fixture: ComponentFixture<SupportPageAddCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageAddCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageAddCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
