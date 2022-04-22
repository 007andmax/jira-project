import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicSearchComponent } from './super-admin-public-search.component';

describe('SuperAdminPublicSearchComponent', () => {
  let component: SuperAdminPublicSearchComponent;
  let fixture: ComponentFixture<SuperAdminPublicSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
