import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicCategoryComponent } from './super-admin-public-category.component';

describe('SuperAdminPublicCategoryComponent', () => {
  let component: SuperAdminPublicCategoryComponent;
  let fixture: ComponentFixture<SuperAdminPublicCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
