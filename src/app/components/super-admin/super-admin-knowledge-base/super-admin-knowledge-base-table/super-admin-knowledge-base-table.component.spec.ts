import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseTableComponent } from './super-admin-knowledge-base-table.component';

describe('SuperAdminKnowledgeBaseTableComponent', () => {
  let component: SuperAdminKnowledgeBaseTableComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
