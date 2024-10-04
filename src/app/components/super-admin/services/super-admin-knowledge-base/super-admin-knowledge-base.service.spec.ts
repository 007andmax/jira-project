import { TestBed } from '@angular/core/testing';

import { SuperAdminKnowledgeBaseService } from './super-admin-knowledge-base.service';

describe('SuperAdminKnowledgeBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperAdminKnowledgeBaseService = TestBed.get(SuperAdminKnowledgeBaseService);
    expect(service).toBeTruthy();
  });
});
