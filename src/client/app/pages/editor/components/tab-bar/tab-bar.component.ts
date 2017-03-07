// Core
import {
    AfterViewInit, Component, ElementRef, Input, ViewChild
} from '@angular/core';

// Own
import { EditorTab, OPERATION_STATUS, EDITOR_STATUS } from '../../editor.tab';

declare var $: any;


@Component({
    moduleId: module.id,
    selector: 'sd-tab-bar',
    templateUrl: 'tab-bar.component.html',
    styleUrls: ['tab-bar.component.css']
})
export class TabBarComponent implements AfterViewInit {
    @Input('tabs') public tabs: EditorTab[];
    @ViewChild('tabMenu') private tabMenu: ElementRef;

    private readonly MAX_TABS: number = 10;

    public ngAfterViewInit() {
        this.setDefaultTabStatuses(this.tabs[0]);
    }

    // tslint:disable-next-line:no-unused-locals
    public mayAddTab(): boolean {
        return this.tabs.length < this.MAX_TABS;
    }

    // tslint:disable-next-line:no-unused-locals
    public onActivateTab(tab: EditorTab) {
        for (let t of this.tabs) {
            t.active = false;
        }
        tab.active = true;
    }

    // tslint:disable-next-line:no-unused-locals
    public onEditTab(tab: EditorTab) {
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onCloseTab(tab: EditorTab) {
        let index = this.tabs.indexOf(tab);
        this.tabs.splice(index, 1);

        if (this.tabs.length > 0) {
            this.tabs[this.tabs.length - 1].active = true;
        } else {
            this.onNewTab();
        }
    }

    // tslint:disable-next-line:no-unused-locals
    public onNewTab(): EditorTab {
        let id = this.getFirstAvailableTabId();
        let tab: EditorTab = {
            id: id,
            active: true,
            title: 'Tab # ' + id,
            editor: null,
            port: null,
            term: null
        };

        for (let other of this.tabs) {
            other.active = false;
        }

        // Before creating the new tab (i.e. adding it to `this.tabs`, make
        // the previously last tab active, to workaround bugs in Bootstrap:
        // https://github.com/twbs/bootstrap/issues/21223
        $(this.tabMenu.nativeElement).find('a:last').tab('show');

        this.tabs.push(tab);
        this.setDefaultTabStatuses(tab);

        return tab;
    }


    ///////////////////////////////////////////////////////////////////////////


    private setDefaultTabStatuses(tab: EditorTab) {
        tab.connectionStatus = OPERATION_STATUS.NOT_STARTED;
        tab.uploadStatus = OPERATION_STATUS.NOT_STARTED;
        tab.editorStatus = EDITOR_STATUS.READY;
    }

    private getFirstAvailableTabId(): number {
        let max = 0;
        for (let tab of this.tabs) {
            if (tab.id > max) {
                max = tab.id;
            }
        }
        return max + 1;
    }
}
