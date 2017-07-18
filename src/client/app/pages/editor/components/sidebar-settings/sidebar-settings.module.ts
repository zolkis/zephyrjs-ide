// Core modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Third-party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome';
import { LocalStorageModule } from 'angular-2-local-storage';
import { UiSwitchModule } from 'angular2-ui-switch';

// This module
import { SidebarSettingsComponent } from './sidebar-settings.component';


@NgModule({
    imports: [
        CommonModule,
        Angular2FontawesomeModule,
        LocalStorageModule.withConfig({
            prefix: 'zephyrjs-ide',
            storageType: 'localStorage'
        }),
        UiSwitchModule
    ],
    declarations: [SidebarSettingsComponent],
    exports: [SidebarSettingsComponent]
})
export class SidebarSettingsModule { }
