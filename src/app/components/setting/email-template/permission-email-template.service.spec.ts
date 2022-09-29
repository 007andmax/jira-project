import { TestBed, inject } from '@angular/core/testing';

import { PermissionEmailTemplateService } from './permission-email-template.service';

describe('PermissionEmailTempleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionEmailTemplateService]
    });
  });

  it('should be created', inject([PermissionEmailTemplateService], (service: PermissionEmailTemplateService) => {
    expect(service).toBeTruthy();
  }));
});
