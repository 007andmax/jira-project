import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseNewsComponent } from './super-admin-knowledge-base-news.component';

describe('SuperAdminKnowledgeBaseNewsComponent', () => {
  let component: SuperAdminKnowledgeBaseNewsComponent;
  let fixture: ComponentFixture<SuperAdminKnowledgeBaseNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperAdminKnowledgeBaseNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminKnowledgeBaseNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
