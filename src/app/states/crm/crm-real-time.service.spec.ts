import { TestBed, inject } from '@angular/core/testing';

import { CrmRealTimeService } from './crm-real-time.service';

describe('CrmRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrmRealTimeService]
    });
  });

  it('should be created', inject([CrmRealTimeService], (service: CrmRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
