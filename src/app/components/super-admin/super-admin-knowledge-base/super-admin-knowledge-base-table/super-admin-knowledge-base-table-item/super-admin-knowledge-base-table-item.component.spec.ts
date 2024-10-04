import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseTableItemComponent } from './super-admin-knowledge-base-table-item.component';

describe('SuperAdminKnowledgeBaseTableItemComponent', () => {
  let component: SuperAdminKnowledgeBaseTableItemComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseTableItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseTableItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseTableItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
