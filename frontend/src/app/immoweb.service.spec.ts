import { TestBed } from '@angular/core/testing';

import { ImmowebService } from './immoweb.service';

describe('ImmowebService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImmowebService = TestBed.get(ImmowebService);
    expect(service).toBeTruthy();
  });
});
