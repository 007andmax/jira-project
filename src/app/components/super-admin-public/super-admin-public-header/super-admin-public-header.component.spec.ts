import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicHeaderComponent } from './super-admin-public-header.component';

describe('SuperAdminPublicHeaderComponent', () => {
  let component: SuperAdminPublicHeaderComponent;
  let fixture: ComponentFixture<SuperAdminPublicHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
