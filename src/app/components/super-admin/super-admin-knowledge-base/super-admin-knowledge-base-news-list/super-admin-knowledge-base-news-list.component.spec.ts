import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseNewsListComponent } from './super-admin-knowledge-base-news-list.component';

describe('SuperAdminKnowledgeBaseNewsListComponent', () => {
  let component: SuperAdminKnowledgeBaseNewsListComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseNewsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseNewsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseNewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
