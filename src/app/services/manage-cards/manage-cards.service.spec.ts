import { TestBed } from '@angular/core/testing';

import { ManageCardsService } from './manage-cards.service';

describe('ManageCardsService', () => {
  let service: ManageCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
