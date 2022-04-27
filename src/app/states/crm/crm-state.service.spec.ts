import { TestBed, inject } from '@angular/core/testing';

import { CrmStateService } from './crm-state.service';

describe('CrmStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrmStateService]
    });
  });

  it('should be created', inject([CrmStateService], (service: CrmStateService) => {
    expect(service).toBeTruthy();
  }));
});
