import { Injectable } from '@angular/core';
import { ReflectiveInjector } from '@angular/core';

import { TestBed, inject } from '@angular/core/testing';
import { LocalStorageModule, LocalStorageService } from 'angular-2-local-storage';
import { WebUsbService } from './webusb.service';
import { SettingsService } from '../../pages/editor/settings.service';


@Injectable()
class MockLocalStorageService {
    public contents: any = {
        'SETTINGS.editor.fontSize': 12,
        'SETTINGS.editor.lineNumbers': true,
        'SETTINGS.editor.deviceThrottle': true
    };

    public get(prop: string): string {
        return this.contents[prop];
    }

    public set(prop: string, val: string) {
        this.contents[prop] = val;
    }
}

export function main() {
  describe('WebUsb Service', () => {
    let webusbService: WebUsbService;

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
          providers: [
              {
                  provide: LocalStorageService,
                  useClass: MockLocalStorageService
              },
              SettingsService,
              WebUsbService
          ]
      });
    });

    beforeEach(inject([WebUsbService], (service: WebUsbService) => {
        webusbService = service;
    }));

    it('requestPort should work', done => {
        expect(webusbService.requestPort).toBeDefined();

        // Expect requestPort to fail because obviously navigator.usb is
        // missing when testing. TODO: mock it.
        webusbService.requestPort().catch(() => {
            done();
        });
    });

    it('connect should work', () => {
        expect(webusbService.connect).toBeDefined();
    });

    it('send should work', () => {
        expect(webusbService.send).toBeDefined();
    });

    it('callbacks should be defined', () => {
        expect(webusbService.onReceive).toBeDefined();
        expect(webusbService.onReceiveError).toBeDefined();
    });
  });
}
