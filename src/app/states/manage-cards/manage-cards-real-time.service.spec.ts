import { TestBed } from '@angular/core/testing';

import { ManageCardsRealTimeService } from './manage-cards-real-time.service';

describe('ManageCardsRealTimeService', () => {
  let service: ManageCardsRealTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCardsRealTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
