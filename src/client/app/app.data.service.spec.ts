import { ReflectiveInjector } from '@angular/core';

import { AppDataService } from './app.data.service';


export function main() {
    describe('AppData Service', () => {
        let service: AppDataService;

        beforeEach(() => {
            let injector = ReflectiveInjector.resolveAndCreate([
                AppDataService
            ]);
            service = injector.get(AppDataService);
        });

        it('editor should have one tab initially', () => {
            expect(service.editorTabs.length).toBe(1);
        });

        it('adding an editor tab should work', () => {
            let tab = service.newEditorTab();
            expect(tab.id).toBe(2);
            expect(tab.active).toBe(true);
            expect(service.editorTabs[0].active).toBe(false);
            expect(tab.title).toBe('Tab # 2');
            expect(service.editorTabs.length).toBe(2);

            // No commit
            tab = service.newEditorTab(false);
            expect(service.editorTabs.length).toBe(2);
        });

        it('getting an editor tab should work', () => {
            let tab = service.getEditorTab(0);
            expect(tab).toBeTruthy();
        });

        it('removing an editor tab should work', () => {
            // Removing the only tab should not alter the tab count
            service.removeEditorTab(service.getEditorTab(0));
            expect(service.editorTabs.length).toBe(1);

            let tab = service.newEditorTab();
            service.removeEditorTab(tab);
            expect(service.editorTabs.length).toBe(1);
        });

        it('renaming an editor tab should work', () => {
            let tab = service.getEditorTab(0);
            service.renameEditorTab(tab, 'New title');
            expect(tab.title).toBe('New title');
        });
    });
}
