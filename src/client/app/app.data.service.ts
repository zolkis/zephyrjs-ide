import { Injectable } from '@angular/core';

import { EditorTab } from './pages/editor/editor.tab';


/* A service to hold data that's shared across the whole app */
@Injectable()
export class AppDataService {
    public editorTabs: Array<EditorTab> = [{
        id: 1,
        active: true,
        title: 'Tab # 1',
        editor: null,
        port: null,
        term: null
    }];
}
