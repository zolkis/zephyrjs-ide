import { Injectable, EventEmitter, Output } from '@angular/core';

import { LocalStorageService } from 'angular-2-local-storage';


@Injectable()
export class SettingsService {
    // E.g. 'zephyrjs-ide.SETTINGS.foo'
    readonly PREFIX: string = 'SETTINGS.';

    @Output() onEditorFontSizeChanged = new EventEmitter();
    @Output() onEditorLineNumbersChanged = new EventEmitter();

    private _settings: any = {
        editor: {
            defaultFontSize: 12,
            minimumFontSize: 6,
            maximumFontSize: 24,
            fontSize: 12,

            lineNumbers: true
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
}
