import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseEditComponent } from './super-admin-knowledge-base-edit.component';

describe('SuperAdminKnowledgeBaseEditComponent', () => {
  let component: SuperAdminKnowledgeBaseEditComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
