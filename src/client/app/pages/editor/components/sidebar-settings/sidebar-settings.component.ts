import { Component } from '@angular/core';

import { SettingsService, WebUsbConnectionBackend } from '../../settings.service';


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-settings',
    templateUrl: 'sidebar-settings.component.html',
    styleUrls: ['sidebar-settings.component.css']
})
export class SidebarSettingsComponent {
    public selectedWebUsbConnectionBackend: WebUsbConnectionBackend;

    public constructor(public settingsService: SettingsService) {
        this.selectedWebUsbConnectionBackend =
            this.settingsService.getWebUsbConnectionBackend();
    }

    public onWebUsbConnectionBackendChanged() {
        this.settingsService.setWebUsbConnectionBackend(
            this.selectedWebUsbConnectionBackend);
    }

    public onFontSizeDecreaseClicked() {
        this.settingsService.decreaseEditorFontSize();
    }

    public onFontSizeDefaultClicked() {
        this.settingsService.setDefaultEditorFontSize();
    }

    public onFontSizeIncreaseClicked() {
        this.settingsService.increaseEditorFontSize();
    }

    public onLineNumbersSwitchClicked() {
        this.settingsService.toggleEditorLineNumbers();
    }

    public onMinimapSwitchClicked() {
        this.settingsService.toggleEditorMinimap();
    }

    public onDeviceThrottleSwitchClicked() {
        this.settingsService.toggleDeviceThrottle();
    }
}
