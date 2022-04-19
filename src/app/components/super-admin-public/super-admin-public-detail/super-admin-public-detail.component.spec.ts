import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicDetailComponent } from './super-admin-public-detail.component';

describe('SuperAdminPublicDetailComponent', () => {
  let component: SuperAdminPublicDetailComponent;
  let fixture: ComponentFixture<SuperAdminPublicDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
