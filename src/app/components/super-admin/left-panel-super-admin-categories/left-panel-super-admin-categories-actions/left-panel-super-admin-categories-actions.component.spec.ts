import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSuperAdminCategoriesActionsComponent } from './left-panel-super-admin-categories-actions.component';

describe('LeftPanelSuperAdminCategoriesActionsComponent', () => {
  let component: LeftPanelSuperAdminCategoriesActionsComponent;
  let fixture: ComponentFixture<LeftPanelSuperAdminCategoriesActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSuperAdminCategoriesActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSuperAdminCategoriesActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
