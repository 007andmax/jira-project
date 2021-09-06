import { TestBed, inject } from '@angular/core/testing';

import { KafkaRealTimeService } from './kafka-real-time.service';

describe('KafkaRealTimeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KafkaRealTimeService]
    });
  });

  it('should be created', inject([KafkaRealTimeService], (service: KafkaRealTimeService) => {
    expect(service).toBeTruthy();
  }));
});
