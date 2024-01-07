import { TestBed } from '@angular/core/testing';

import { AccountTokenService } from './account-token.service';

describe('AccountTokenService', () => {
  let service: AccountTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
