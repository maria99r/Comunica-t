import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectionGuard } from './redirection.guard';

describe('redirectionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => redirectionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
