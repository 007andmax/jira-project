import { TestBed } from '@angular/core/testing';

import { ManageCardsStateService } from './manage-cards-state.service';

describe('ManageCardsStateService', () => {
  let service: ManageCardsStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCardsStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
