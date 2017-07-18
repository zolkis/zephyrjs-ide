import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { SidebarSettingsModule } from './sidebar-settings.module';
import { SettingsService } from '../../settings.service';


export function main() {
   describe('SidebarSettings component', () => {

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [SidebarSettingsModule],
        providers: [SettingsService]
      });
    });

    it('should work',
      async(() => {
        TestBed.compileComponents().then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            expect(fixture).not.toBe(null);
          });
        }));
    });
}

@Component({
  selector: 'test-cmp',
  template: '<sd-sidebar-settings></sd-sidebar-settings>'
})
class TestComponent { }
