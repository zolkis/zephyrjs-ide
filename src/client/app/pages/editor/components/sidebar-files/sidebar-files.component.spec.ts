import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { SidebarFilesModule } from './sidebar-files.module';


export function main() {
   describe('SidebarFiles component', () => {

    beforeEach(() => {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [SidebarFilesModule]
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
  template: '<sd-sidebar-files></sd-sidebar-files>'
})
class TestComponent { }
