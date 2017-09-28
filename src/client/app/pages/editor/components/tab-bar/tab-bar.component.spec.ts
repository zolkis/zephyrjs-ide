import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { AppDataService } from '../../../../app.data.service';
import { EditorTab } from '../../editor.tab';
import { TabBarModule } from './tab-bar.module';
import { TabBarComponent } from './tab-bar.component';


export function main() {
  describe('TabBar component', () => {

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        declarations: [TestComponent],
        providers: [AppDataService],
        imports: [TabBarModule]
      });
    });

    it('should work', async(() => {
      TestBed.compileComponents().then(() => {
        let fixture = TestBed.createComponent(TestComponent);
        let el = fixture.debugElement.children[0].nativeElement;

        fixture.detectChanges();
        expect(el.querySelectorAll('.tab-title')[0].textContent)
          .toContain('Tab # 1');
      });
    }));

    it('adding/activating/closing tabs should work', async(() => {
      TestBed.compileComponents().then(() => {
        const fixture = TestBed.createComponent(TabBarComponent);
        let component = fixture.componentInstance;

        expect(component.tabs.length).toBe(1);
        expect(component.tabs[0].active).toBe(true);

        component.onNewTab();
        expect(component.tabs.length).toBe(2);
        expect(component.tabs[0].active).toBe(false);
        expect(component.tabs[1].active).toBe(true);

        component.onActivateTab(component.tabs[0]);
        expect(component.tabs[0].active).toBe(true);
        expect(component.tabs[1].active).toBe(false);

        component.onCloseTab(component.tabs[0]);
        expect(component.tabs.length).toBe(1);
        expect(component.tabs[0].active).toBe(true);

        // Close only tab
        component.onCloseTab(component.tabs[0]);
        expect(component.tabs.length).toBe(1);
      });
    }));

    it('editing tabs should work', async(() => {
      TestBed.compileComponents().then(() => {
        const fixture = TestBed.createComponent(TabBarComponent);
        let component = fixture.componentInstance;

        component.onEditTab(component.tabs[0]);
        expect(component.tabs[0].editing).toBe(true);
        expect(component.tabs[0].hasError).toBeUndefined();

        // No error
        component.onFinishedEditingTab(component.tabs[0]);
        expect(component.tabs[0].editing).toBe(false);
        expect(component.tabs[0].hasError).toBe(false);

        component.onNewTab();
        component.onEditTab(component.tabs[1]);
        component.tabs[1].title = 'Tab # 1'; // already taken by tabs[0]

        component.onFinishedEditingTab(component.tabs[1]);
        expect(component.tabs[1].editing).toBe(true);
        expect(component.tabs[1].hasError).toBe(true);

        component.onChangeEditingTab(component.tabs[1]);
        expect(component.tabs[0].hasError).toBe(false);
      });
    }));

  }); // ./describe
}

@Component({
  selector: 'test-cmp',
  template: '<sd-tab-bar></sd-tab-bar>'
})
class TestComponent {}
