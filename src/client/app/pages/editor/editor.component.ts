// Core
import { Component } from '@angular/core';

// Third party
import { NotificationsService } from 'angular2-notifications';

// Own
import { AppDataService } from '../../app.data.service';
import { EditorTab } from './editor.tab';
import { WebUsbService } from '../../shared/webusb/webusb.service';


@Component({
    moduleId: module.id,
    selector: 'sd-editor',
    templateUrl: 'editor.component.html',
    styleUrls: ['editor.component.css']
})
export class EditorComponent {
    public notificationOptions = {
        timeOut: 3000,
        showProgressBar: false
    };

    public tabs: Array<EditorTab>;

    public consoleToggledOff: boolean = false;

    // Methods

    constructor(
        private appDataService: AppDataService,
        private notificationsService: NotificationsService,
        private webusbService: WebUsbService) {
        this.tabs = appDataService.editorTabs;
        this.appDataService.registerFooterButton(
            'Console',
            'btn btn-primary active',
            () => {
                let button = this.appDataService.getFooterButtonByTitle('Console');
                this.consoleToggledOff = !this.consoleToggledOff;
                if (this.consoleToggledOff) {
                    button.cls = 'btn btn-primary';
                } else {
                    button.cls = 'btn btn-primary active';
                }
            });
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
}
