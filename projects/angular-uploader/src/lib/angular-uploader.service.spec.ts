import { TestBed, inject } from '@angular/core/testing';

import { AngularUploaderService } from './angular-uploader.service';

describe('AngularUploaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AngularUploaderService]
    });
  });

  it('should be created', inject([AngularUploaderService], (service: AngularUploaderService) => {
    expect(service).toBeTruthy();
  }));
});
