import { TestBed, inject } from '@angular/core/testing';

import { KafkaStateService } from './kafka-state.service';

describe('KafkaStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KafkaStateService]
    });
  });

  it('should be created', inject([KafkaStateService], (service: KafkaStateService) => {
    expect(service).toBeTruthy();
  }));
});
