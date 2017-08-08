import { Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from 'angular-2-local-storage';

import { SettingsService } from './settings.service';


@Injectable()
class MockLocalStorageService {
    public contents: any = {
        'SETTINGS.editor.fontSize': 12,
        'SETTINGS.editor.lineNumbers': true,
        'SETTINGS.editor.minimap': false,
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
    describe('Settings Service', () => {
        let service: SettingsService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: LocalStorageService,
                        useClass: MockLocalStorageService
                    },
                    SettingsService
                ]
            });
        });

        beforeEach(inject([SettingsService], (settingsService: SettingsService) => {
            service = settingsService;
        }));

        it('editor.fontSize functions should work', () => {
            expect(service.getEditorFontSize()).toBe(12);

            service.increaseEditorFontSize();
            expect(service.getEditorFontSize()).toBe(13);

            service.decreaseEditorFontSize();
            expect(service.getEditorFontSize()).toBe(12);

            // No smaller than the minimum.
            service.setEditorFontSize(6);
            service.decreaseEditorFontSize();
            expect(service.getEditorFontSize()).toBe(6);

            // No larger than the maximum.
            service.setEditorFontSize(24);
            service.increaseEditorFontSize();
            expect(service.getEditorFontSize()).toBe(24);
        });

        it('editor.lineNumbers functions should work', () => {
            expect(service.getEditorLineNumbers()).toBe(true);

            service.toggleEditorLineNumbers();
            expect(service.getEditorLineNumbers()).toBe(false);

            service.setEditorLineNumbers(true);
            expect(service.getEditorLineNumbers()).toBe(true);

            service.setEditorLineNumbers(false);
            expect(service.getEditorLineNumbers()).toBe(false);
        });

        it('editor.minimap functions should work', () => {
            expect(service.getEditorMinimap()).toBe(false);

            service.toggleEditorMinimap();
            expect(service.getEditorMinimap()).toBe(true);

            service.setEditorMinimap(true);
            expect(service.getEditorMinimap()).toBe(true);

            service.setEditorMinimap(false);
            expect(service.getEditorMinimap()).toBe(false);
        });

        it('editor.deviceThrottle functions should work', () => {
            expect(service.getDeviceThrottle()).toBe(true);

            service.toggleDeviceThrottle();
            expect(service.getDeviceThrottle()).toBe(false);

            service.setDeviceThrottle(true);
            expect(service.getDeviceThrottle()).toBe(true);

            service.setDeviceThrottle(false);
            expect(service.getDeviceThrottle()).toBe(false);
        });
    });
}
