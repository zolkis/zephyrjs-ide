import { Component, EventEmitter, Output } from '@angular/core';

import { ExampleService } from '../../example.service';


@Component({
    moduleId: module.id,
    selector: 'sd-sidebar-examples',
    templateUrl: 'sidebar-examples.component.html',
    styleUrls: ['sidebar-examples.component.css'],
    providers: [ExampleService]
})
export class SidebarExamplesComponent {
    @Output()
    private onFileSelected = new EventEmitter();

    constructor(public exampleService: ExampleService) { }

    // tslint:disable-next-line:no-unused-locals
    public onFilenameClicked(filename: string) {
        this.onFileSelected.emit({
            filename: filename,
            contents: this.exampleService.load(filename)
        });
        return false;
    }
}
