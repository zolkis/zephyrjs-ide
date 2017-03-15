// Core
import {
    Component, ElementRef, Input, ViewChild
} from '@angular/core';

// Own
import { AppDataService } from '../../../../app.data.service';
import { EditorTab } from '../../editor.tab';

declare var $: any;


@Component({
    moduleId: module.id,
    selector: 'sd-tab-bar',
    templateUrl: 'tab-bar.component.html',
    styleUrls: ['tab-bar.component.css']
})
export class TabBarComponent {
    public tabs: EditorTab[];
    @ViewChild('tabMenu') private tabMenu: ElementRef;

    private readonly MAX_TABS: number = 10;

    public constructor(private _appDataService: AppDataService) {
        this.tabs = _appDataService.editorTabs;
    }

    // tslint:disable-next-line:no-unused-locals
    public mayAddTab(): boolean {
        return this.tabs.length < this.MAX_TABS;
    }

    // tslint:disable-next-line:no-unused-locals
    public onActivateTab(tab: EditorTab) {
        this._appDataService.activateEditorTab(tab);
    }

    // tslint:disable-next-line:no-unused-locals
    public onEditTab(tab: EditorTab) {
        let input = $(this.tabMenu.nativeElement).find('.tab-title-editor');
        tab.editing = true;

        setTimeout(() => {
            input.focus();
        }, 0);

        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onFinishedEditingTab(tab: EditorTab) {
        tab.editing = false;
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onCloseTab(tab: EditorTab) {
        this._appDataService.removeEditorTab(tab);
    }

    // tslint:disable-next-line:no-unused-locals
    public onNewTab() {
        let tab = this._appDataService.newEditorTab();
    }
}
