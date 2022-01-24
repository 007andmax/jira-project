import { TestBed, inject } from '@angular/core/testing';

import { WebsocketStateService } from './websocket-state.service';

describe('WebsocketStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebsocketStateService]
    });
  });

  it('should be created', inject([WebsocketStateService], (service: WebsocketStateService) => {
    expect(service).toBeTruthy();
  }));
});
