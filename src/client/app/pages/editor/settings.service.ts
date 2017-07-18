import { Injectable, EventEmitter, Output } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';


@Injectable()
export class SettingsService {
    // E.g. 'zephyrjs-ide.SETTINGS.foo'
    readonly PREFIX: string = 'SETTINGS.';

    @Output() onEditorFontSizeChanged = new EventEmitter();

    private _settings: any = {
        editor: {
            defaultFontSize: 12,
            minimumFontSize: 6,
            maximumFontSize: 24,
            fontSize: 12
        }
    };

    public constructor(private _localStorageService: LocalStorageService) {
        let val = this._localStorageService.get(this.PREFIX + 'editor.fontSize') as number;
        if (val !== null) {
            this.setEditorFontSize(val);
        }
    }

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
}
