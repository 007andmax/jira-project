import { TestBed, inject } from '@angular/core/testing';

import { PermissionManageTagsService } from './permission-manage-tags.service';

describe('PermissionManageTagsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PermissionManageTagsService]
    });
  });

  it('should be created', inject([PermissionManageTagsService], (service: PermissionManageTagsService) => {
    expect(service).toBeTruthy();
  }));
});
