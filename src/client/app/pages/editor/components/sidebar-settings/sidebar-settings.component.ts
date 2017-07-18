import { Component } from '@angular/core';

import { SettingsService } from '../../settings.service';


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-settings',
    templateUrl: 'sidebar-settings.component.html',
    styleUrls: ['sidebar-settings.component.css']
})
export class SidebarSettingsComponent {
    public constructor(public settingsService: SettingsService) {
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
}
