import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSuperAdminCategoriesComponent } from './left-panel-super-admin-categories.component';

describe('LeftPanelSuperAdminCategoriesComponent', () => {
  let component: LeftPanelSuperAdminCategoriesComponent;
  let fixture: ComponentFixture<LeftPanelSuperAdminCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSuperAdminCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSuperAdminCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
