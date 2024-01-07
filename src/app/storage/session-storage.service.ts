import { Injectable } from '@angular/core';
import { KeyValueStore } from './key-value-store';
import { validateNotBlank, validateDefined } from '@src/app/util/validation';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService implements KeyValueStore<string> {

  constructor() { }

  get(key: string): string | null {
    validateNotBlank(key, "key");

    return sessionStorage.getItem(key);
  }

  put(key: string, value: string): void {
    validateNotBlank(key, "key");
    validateDefined(value, "value");

    sessionStorage.setItem(key, value);
  }

  remove(key: string): void {
    sessionStorage.removeItem(key);
  }

}
