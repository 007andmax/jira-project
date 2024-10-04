import { TestBed } from '@angular/core/testing';

import { FileManagementStateService } from './file-management-state.service';

describe('FileManagementStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileManagementStateService = TestBed.get(FileManagementStateService);
    expect(service).toBeTruthy();
  });
});
