import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseAddComponent } from './super-admin-knowledge-base-add.component';

describe('SuperAdminKnowledgeBaseAddComponent', () => {
  let component: SuperAdminKnowledgeBaseAddComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
