// Core
import { Component, ElementRef, ViewChild } from '@angular/core';

// Third party
import { NotificationsService } from 'angular2-notifications';

// Own
import { AppDataService } from '../../app.data.service';
import { FileService } from './file.service';
import { ExampleService } from './example.service';
import { EditorTab } from './editor.tab';
import { WebUsbService } from '../../shared/webusb/webusb.service';


@Component({
    moduleId: module.id,
    selector: 'sd-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css'],
    providers: [ExampleService, FileService]
})
export class EditorComponent {
    public notificationOptions = {
        timeOut: 3000,
        showProgressBar: false
    };

    public sidebarOptions = {
        opened: true
    };

    public secondarySidebarOptions = {
        opened: false,
        content: ''
    };

    public tabs: Array<EditorTab>;

    @ViewChild('toggleConsoleButton')
    public toggleConsoleButton: ElementRef;

    public consoleToggledOff: boolean = false;

    // Methods

    constructor(
        private appDataService: AppDataService,
        public exampleService: ExampleService,
        public fileService: FileService,
        private notificationsService: NotificationsService,
        private webusbService: WebUsbService) {
        this.tabs = appDataService.editorTabs;
    }

    // tslint:disable-next-line:no-unused-locals
    public onToggleSidebar() {
        this.sidebarOptions.opened = !this.sidebarOptions.opened;
    }

    // tslint:disable-next-line:no-unused-locals
    public onToggleConsole() {
        this.consoleToggledOff = !this.consoleToggledOff;
    }

    // tslint:disable-next-line:no-unused-locals
    public onCloseSecondarySidebar() {
        this.secondarySidebarOptions.opened = false;
        this.secondarySidebarOptions.content = '';
    }

    // tslint:disable-next-line:no-unused-locals
    public onFilesClicked() {
        if (this.secondarySidebarOptions.opened &&
            this.secondarySidebarOptions.content === 'files') {
            this.onCloseSecondarySidebar();
        } else {
            this.secondarySidebarOptions.content = 'files';
            this.secondarySidebarOptions.opened = true;
            this._adjustBackdropPosition();
        }
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onExamplesClicked() {
        if (this.secondarySidebarOptions.opened &&
            this.secondarySidebarOptions.content === 'examples') {
            this.onCloseSecondarySidebar();
        } else {
            this.secondarySidebarOptions.content = 'examples';
            this.secondarySidebarOptions.opened = true;
            this._adjustBackdropPosition();
        }
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onExampleFilenameClicked(filename: string) {
        // Switch to it if we already have it open
        for(let tab of this.tabs) {
            if (tab.title === filename) {
                this.appDataService.activateEditorTab(tab);
                this.onCloseSecondarySidebar();
                return false;
            }
        }

        // Otherwise we create a new tab

        let contents = this.exampleService.load(filename);
        let tab = this.appDataService.newEditorTab();
        tab.title = filename;

        function _setContents(tab: EditorTab, contents: string) {
            // Wait for editor to become available
            setTimeout(() => {
                if (tab.editor !== null) {
                    tab.editor.setValue(contents);
                } else {
                    _setContents(tab, contents);
                }
            }, 100);
        }

        _setContents(tab, contents);

        this.onCloseSecondarySidebar();
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onCloseConsole() {
        this.consoleToggledOff = true;
        return false;
    }

    // tslint:disable-next-line:no-unused-locals
    public onWarning(message: any) {
        let overrides: any = {};

        if (message.sticky) {
            overrides['timeOut'] = 0;
        }

        this.notificationsService.alert(
            message.header, message.body, overrides);
    }

    // tslint:disable-next-line:no-unused-locals
    public onError(message: any) {
        let overrides: any = {};

        if (message.sticky) {
            overrides['timeOut'] = 0;
        }

        this.notificationsService.error(
            message.header, message.body, overrides);
    }

    // tslint:disable-next-line:no-unused-locals
    public onBeginResizing() {
        let overlays = document.getElementsByClassName(
            'console-resizing-overlay');
        [].forEach.call(overlays, (overlay: HTMLElement) => {
            overlay.style.display = 'block';
        });
    }

    // tslint:disable-next-line:no-unused-locals
    public onEndedResizing() {
        let overlays = document.getElementsByClassName(
            'console-resizing-overlay');
        [].forEach.call(overlays, (overlay: HTMLElement) => {
            overlay.style.display = 'none';
        });
    }


    ///////////////////////////////////////////////////////////////////////////

    /*
    Position the secondary sidebar's backdrop accurately. Unfortunately we
    cannot do this via CSS because the secondary sidebar's backdrop does not
    have an ancestor that specifies whether or not the primary sidebar is
    closed, even tho the secondary sidebar is nested within the primary one.

    We do stuff in a timeout to allow the DOM to be updated with the newly
    created .ng-sidebar__backdrop element.
    */
    private _adjustBackdropPosition() {
        let left = ['480px','372px'],
            width = ['calc(100% - 480px)', 'calc(100% - 372px)'];

        setTimeout(() => {
            let backdrop = document.getElementsByClassName(
                'ng-sidebar__backdrop')[0] as HTMLElement;
            if (backdrop !== undefined) {
                backdrop.style.left = left[this.sidebarOptions.opened ? 0 : 1];
                backdrop.style.width =
                    width[this.sidebarOptions.opened ? 0 : 1];
            }
        }, 1);
    }
}
