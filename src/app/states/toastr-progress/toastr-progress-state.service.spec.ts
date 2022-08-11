import { TestBed, inject } from '@angular/core/testing';

import { ToastrProgressStateService } from './toastr-progress-state.service';

describe('ToastrProgressStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrProgressStateService]
    });
  });

  it('should be created', inject([ToastrProgressStateService], (service: ToastrProgressStateService) => {
    expect(service).toBeTruthy();
  }));
});
