import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageCategoryComponent } from './support-page-category.component';

describe('SupportPageCategoryComponent', () => {
  let component: SupportPageCategoryComponent;
  let fixture: ComponentFixture<SupportPageCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
