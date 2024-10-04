import { TestBed } from '@angular/core/testing';

import { FileManagementRealTimeService } from './file-management-real-time.service';

describe('FileManagementRealTimeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileManagementRealTimeService = TestBed.get(FileManagementRealTimeService);
    expect(service).toBeTruthy();
  });
});
