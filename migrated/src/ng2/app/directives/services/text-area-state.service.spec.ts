import { TestBed } from '@angular/core/testing';

import { TextAreaStateService } from './text-area-state.service';

describe('TextAreaStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextAreaStateService = TestBed.get(TextAreaStateService);
    expect(service).toBeTruthy();
  });
});
