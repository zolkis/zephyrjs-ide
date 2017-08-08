import { Injectable, EventEmitter, Output } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';


@Injectable()
export class SettingsService {
    // E.g. 'zephyrjs-ide.SETTINGS.foo'
    readonly PREFIX: string = 'SETTINGS.';

    @Output() onEditorFontSizeChanged = new EventEmitter();
    @Output() onEditorLineNumbersChanged = new EventEmitter();
    @Output() onEditorMinimapChanged = new EventEmitter();
    @Output() onDeviceThrottleChanged = new EventEmitter();

    private _settings: any = {
        editor: {
            defaultFontSize: 12,
            minimumFontSize: 6,
            maximumFontSize: 24,
            fontSize: 12,
            lineNumbers: true,
            minimap: false,
            deviceThrottle: true
        }
    };

    public constructor(private _localStorageService: LocalStorageService) {
        let fontSize: number =
            this._localStorageService.get(this.PREFIX + 'editor.fontSize') as number;
        if (fontSize !== null) {
            this.setEditorFontSize(fontSize);
        }

        let lineNumbers: boolean =
            this._localStorageService.get(this.PREFIX + 'editor.lineNumbers') as boolean;
        if (lineNumbers !== null) {
            this.setEditorLineNumbers(lineNumbers);
        }

        let minimap: boolean =
            this._localStorageService.get(this.PREFIX + 'editor.minimap') as boolean;
        if (minimap !== null) {
            this.setEditorMinimap(minimap);
        }

        let deviceThrottle: boolean =
            this._localStorageService.get(this.PREFIX + 'editor.deviceThrottle') as boolean;
        if (deviceThrottle !== null) {
            this.setDeviceThrottle(deviceThrottle);
        }
    }

    /*
     * Font size.
     */

    public getEditorFontSize(): number {
        return this._settings.editor.fontSize;
    }

    public setEditorFontSize(size: number) {
        if (size !== this.getEditorFontSize()) {
            this._settings.editor.fontSize = size;
            this._localStorageService.set(this.PREFIX + 'editor.fontSize', size);
            this.onEditorFontSizeChanged.emit(size);
        }
    }

    public decreaseEditorFontSize() {
        if (this.getEditorFontSize() === this._settings.editor.minimumFontSize) {
            return;
        }
        this.setEditorFontSize(this.getEditorFontSize() - 1);
    }

    public setDefaultEditorFontSize() {
        this.setEditorFontSize(this._settings.editor.defaultFontSize);
    }

    public increaseEditorFontSize() {
        if (this.getEditorFontSize() === this._settings.editor.maximumFontSize) {
            return;
        }
        this.setEditorFontSize(this.getEditorFontSize() + 1);
    }

    /*
     * Line numbers.
     */

    public getEditorLineNumbers(): boolean {
        return this._settings.editor.lineNumbers;
    }

    public setEditorLineNumbers(show: boolean) {
        if (show !== this.getEditorLineNumbers()) {
            this._settings.editor.lineNumbers = show;
            this._localStorageService.set(this.PREFIX + 'editor.lineNumbers', show);
            this.onEditorLineNumbersChanged.emit(show);
        }
    }

    public toggleEditorLineNumbers() {
        this.setEditorLineNumbers(!this.getEditorLineNumbers());
    }

    /*
     * Minimap.
     */

    public getEditorMinimap(): boolean {
        return this._settings.editor.minimap;
    }

    public setEditorMinimap(show: boolean) {
        if (show !== this.getEditorMinimap()) {
            this._settings.editor.minimap = show;
            this._localStorageService.set(this.PREFIX + 'editor.minimap', show);
            this.onEditorMinimapChanged.emit(show);
        }
    }

    public toggleEditorMinimap() {
        this.setEditorMinimap(!this.getEditorMinimap());
    }


    /*
     * Device throttle.
     */

    public getDeviceThrottle(): boolean {
        return this._settings.editor.deviceThrottle;
    }

    public setDeviceThrottle(throttle: boolean) {
        if (throttle !== this.getDeviceThrottle()) {
            this._settings.editor.deviceThrottle = throttle;
            this._localStorageService.set(this.PREFIX + 'editor.deviceThrottle', throttle);
            this.onDeviceThrottleChanged.emit(throttle);
        }
    }

    public toggleDeviceThrottle() {
        this.setDeviceThrottle(!this.getDeviceThrottle());
    }
}
