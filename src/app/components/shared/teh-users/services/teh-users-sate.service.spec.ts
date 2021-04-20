import { TestBed } from '@angular/core/testing';

import { TehUsersSateService } from './teh-users-sate.service';

describe('TehUsersSateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TehUsersSateService = TestBed.get(TehUsersSateService);
    expect(service).toBeTruthy();
  });
});
