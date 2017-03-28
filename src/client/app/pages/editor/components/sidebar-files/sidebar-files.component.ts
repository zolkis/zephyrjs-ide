import { Component, EventEmitter, Output } from '@angular/core';

import { AppDataService } from '../../../../app.data.service';
import { FileService } from '../../file.service';
import { EditorTab } from '../../editor.tab';


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-files',
    templateUrl: 'sidebar-files.component.html',
    styleUrls: ['sidebar-files.component.css'],
    providers: [AppDataService, FileService]
})
export class SidebarFilesComponent {
    private tabs: Array<EditorTab>;

    @Output()
    private onFileSelected = new EventEmitter();

    @Output()
    private onFileDeleted = new EventEmitter();


    constructor(
        private appDataService: AppDataService,
        public fileService: FileService) {
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

        let contents = this.fileService.load(filename);
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

    // tslint:disable-next-line:no-unused-locals
    public computeFileSize(filename: string) {
        let contents = this.fileService.load(filename);
        let m = encodeURIComponent(contents).match(/%[89ABab]/g);
        return contents.length + (m ? m.length : 0);
    }

    // tslint:disable-next-line:no-unused-locals
    public onDeleteFileClicked(filename: string) {
        this.fileService.delete(filename);
        this.onFileDeleted.emit(filename);
        return false;
    }
}
