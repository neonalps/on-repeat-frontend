import { TestBed } from '@angular/core/testing';

import { AccountJobService } from './account-job.service';

describe('AccountJobService', () => {
  let service: AccountJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
