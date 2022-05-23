import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicComponent } from './super-admin-public.component';

describe('SuperAdminPublicComponent', () => {
  let component: SuperAdminPublicComponent;
  let fixture: ComponentFixture<SuperAdminPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
