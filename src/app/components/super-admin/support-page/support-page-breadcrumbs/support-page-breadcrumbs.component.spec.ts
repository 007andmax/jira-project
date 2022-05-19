import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportPageBreadcrumbsComponent } from './support-page-breadcrumbs.component';

describe('SupportPageBreadcrumbsComponent', () => {
  let component: SupportPageBreadcrumbsComponent;
  let fixture: ComponentFixture<SupportPageBreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupportPageBreadcrumbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupportPageBreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
