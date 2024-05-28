import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseComponent } from './super-admin-knowledge-base.component';

describe('SuperAdminKnowledgeBaseComponent', () => {
  let component: SuperAdminKnowledgeBaseComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
