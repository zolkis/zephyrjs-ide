// Core modules
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Third-party modules
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { SidebarModule } from 'ng-sidebar/lib/sidebar.module';
import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';

// Own modules
import { MonacoModule } from './components/monaco/monaco.module';
import { ConsoleModule } from './components/console/console.module';
import { DeviceToolbarModule } from './components/device-toolbar/device-toolbar.module';
import { BoardExplorerModule } from './components/board-explorer/board-explorer.module';
import { OcfExplorerModule } from './components/ocf-explorer/ocf-explorer.module';
import { SidebarFilesModule } from './components/sidebar-files/sidebar-files.module';
import { SidebarExamplesModule } from './components/sidebar-examples/sidebar-examples.module';
import { SidebarGitHubModule } from './components/sidebar-github/sidebar-github.module';
import { StatusBarModule } from './components/statusbar/statusbar.module';
import { TabBarModule } from './components/tab-bar/tab-bar.module';

import { SharedModule } from '../../shared/shared.module';

// This module
import { EditorComponent } from './editor.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,

        Angular2FontawesomeModule,
        SimpleNotificationsModule.forRoot(),
        SidebarModule,
        SplitPaneModule,

        MonacoModule,
        ConsoleModule,
        DeviceToolbarModule,
        BoardExplorerModule,
        OcfExplorerModule,
        SidebarFilesModule,
        SidebarExamplesModule,
        SidebarGitHubModule,
        StatusBarModule,
        TabBarModule,

        SharedModule.forRoot()
    ],
    declarations: [
        EditorComponent
    ],
    exports: [EditorComponent]
})
export class EditorModule {}
