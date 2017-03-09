import { Injectable } from '@angular/core';

import {
    EditorTab, OPERATION_STATUS, EDITOR_STATUS
} from './pages/editor/editor.tab';


/* A service to hold data that's shared across the whole app */
@Injectable()
export class AppDataService {
    // Tabs in the editor, containing handles for the editor object,
    // webusb port object, and terminal console object.
    public editorTabs: Array<EditorTab> = [{
        id: 1,
        active: true,
        title: 'Tab # 1',
        editor: null,
        port: null,
        term: null
    }];

    public constructor() {
        this._setDefaultEditorTabStatuses(this.editorTabs[0]);
    }

    // Returns an editor tab by index.
    public getEditorTab(index: number): EditorTab {
        return this.editorTabs[index];
    }

    // Create and return a new default editor tab.
    public newEditorTab(commit: boolean = true): EditorTab {
        let id = this._getFirstAvailableEditorTabId();
        let tab: EditorTab = {
            id: id,
            active: true,
            title: 'Tab # ' + id,
            editor: null,
            port: null,
            term: null
        };
        this._setDefaultEditorTabStatuses(tab);

        for (let other of this.editorTabs) {
            other.active = false;
        }

        if (commit) {
            this.editorTabs.push(tab);
        }

        return tab;
    }

    // Remove an editor tab.
    public removeEditorTab(tab: EditorTab) {
        let index = this.editorTabs.indexOf(tab);
        this.editorTabs.splice(index, 1);

        if (this.editorTabs.length > 0) {
            // Activate the last tab.
            this.editorTabs[this.editorTabs.length - 1].active = true;
        } else {
            // Never allow 0 tabs.
            this.newEditorTab();
        }
    }

    // Rename an editor tab.
    public renameEditorTab(tab: EditorTab, newTitle: string) {
        tab.title = newTitle;
    }


    ///////////////////////////////////////////////////////////////////////////


    private _getFirstAvailableEditorTabId(): number {
        let max = 0;
        for (let tab of this.editorTabs) {
            if (tab.id > max) {
                max = tab.id;
            }
        }
        return max + 1;
    }

    private _setDefaultEditorTabStatuses(tab: EditorTab) {
        tab.connectionStatus = OPERATION_STATUS.NOT_STARTED;
        tab.uploadStatus = OPERATION_STATUS.NOT_STARTED;
        tab.editorStatus = EDITOR_STATUS.READY;
    }
}
