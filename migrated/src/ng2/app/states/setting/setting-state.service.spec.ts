import { TestBed } from '@angular/core/testing';

import { SettingStateService } from './setting-state.service';

describe('SettingStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SettingStateService = TestBed.get(SettingStateService);
    expect(service).toBeTruthy();
  });
});
