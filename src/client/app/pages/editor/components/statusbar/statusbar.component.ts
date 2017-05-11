import { Component, Input } from '@angular/core';

import { EditorTab } from '../../editor.tab';


interface IData {
    cls: string;
    msg: string;
}


@Component({
    moduleId: module.id,
    selector: 'sd-statusbar',
    templateUrl: 'statusbar.component.html',
    styleUrls: ['statusbar.component.css']
})
export class StatusBarComponent {
    @Input('tab') tab: EditorTab;

    // tslint:disable-next-line:no-unused-locals
    public getClass(): string {
        return this.getData().cls;
    }

    // tslint:disable-next-line:no-unused-locals
    public getMessage(): string {
        return this.getData().msg;
    }

    private getData(): IData {
        // TODO: support multiple statuses
        return {
            cls: 'info',
            msg: 'Ready.'
        };
    }
}
