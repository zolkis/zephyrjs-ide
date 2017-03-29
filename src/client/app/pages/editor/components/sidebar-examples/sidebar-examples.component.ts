import { Component, EventEmitter, Output } from '@angular/core';

import { AppDataService } from '../../../../app.data.service';
import { ExampleService } from '../../example.service';
import { EditorTab } from '../../editor.tab';


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-examples',
    templateUrl: 'sidebar-examples.component.html',
    styleUrls: ['sidebar-examples.component.css'],
    providers: [AppDataService, ExampleService]
})
export class SidebarExamplesComponent {
    private tabs: Array<EditorTab>;

    @Output()
    private onFileSelected = new EventEmitter();

    constructor(
        private appDataService: AppDataService,
        public exampleService: ExampleService) {
        this.tabs = appDataService.editorTabs;
    }

    // tslint:disable-next-line:no-unused-locals
    public onFilenameClicked(filename: string) {
        // Switch to it if we already have it open
        for(let tab of this.tabs) {
            if (tab.title === filename) {
                this.appDataService.activateEditorTab(tab);
                this.onFileSelected.emit(filename);
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

        this.onFileSelected.emit(filename);

        return false;
    }
}
