import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftPanelSuperAdminComponent } from './left-panel-super-admin.component';

describe('LeftPanelSuperAdminComponent', () => {
  let component: LeftPanelSuperAdminComponent;
  let fixture: ComponentFixture<LeftPanelSuperAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftPanelSuperAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftPanelSuperAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
