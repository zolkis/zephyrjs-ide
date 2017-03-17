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

    public footerButtons: Array<any> = [];

    public constructor() {
        this._setDefaultEditorTabStatuses(this.editorTabs[0]);
    }

    // Returns an editor tab by index.
    public getEditorTab(index: number): EditorTab {
        return this.editorTabs[index];
    }

    // Create and return a new default editor tab.
    public newEditorTab(): EditorTab {
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
        this.editorTabs.push(tab);
        this.activateEditorTab(tab);

        return tab;
    }

    // Make a tab active, while deactivating all others.
    public activateEditorTab(tab: EditorTab) {
        for (let t of this.editorTabs) {
            t.active = false;
        }
        tab.active = true;
    }

    // Remove an editor tab.
    public removeEditorTab(tab: EditorTab) {
        let index = this.editorTabs.indexOf(tab),
            wasActive = tab.active,
            wasOnly = this.editorTabs.length === 1;

        this.editorTabs.splice(index, 1);

        if (wasActive && !wasOnly) {
            if (index === this.editorTabs.length) {
                // We removed the last tab, so we activate the tab that is now
                // last.
                this.editorTabs[this.editorTabs.length - 1].active = true;
            } else {
                // Let's activate the tab that was right after the one we
                // removed, and that now has its index.
                this.editorTabs[index].active = true;
            }
        }

        if (this.editorTabs.length === 0) {
            // Never allow 0 tabs.
            this.newEditorTab();
        }
    }

    // Will remove all editor tabs and create a new empty one.
    public resetEditorTabs() {
        this.editorTabs = [];
        this.newEditorTab();
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
