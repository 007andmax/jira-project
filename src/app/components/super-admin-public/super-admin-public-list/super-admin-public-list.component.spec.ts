import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminPublicListComponent } from './super-admin-public-list.component';

describe('SuperAdminPublicListComponent', () => {
  let component: SuperAdminPublicListComponent;
  let fixture: ComponentFixture<SuperAdminPublicListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminPublicListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminPublicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
