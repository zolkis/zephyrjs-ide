import { Injectable } from '@angular/core';
import { TestBed, inject } from '@angular/core/testing';

import { LocalStorageService } from 'angular-2-local-storage';

import { FileService } from './file.service';


interface MockContent {
    filename: string;
    contents: string;
};

@Injectable()
class MockLocalStorageService {
    public contents: Array<MockContent> = [];

    public get(filename: string): string {
        for (let i of this.contents) {
            if (i.filename === filename) {
                return i.contents;
            }
        }
        return null;
    }

    public set(filename: string, contents: string) {
        for (let i of this.contents) {
            if (i.filename === filename) {
                i.contents = contents;
                return true;
            }
        }

        this.contents.push({filename: filename, contents: contents});
        return true;
    }

    public keys(): Array<string> {
        let keys: Array<string> = [];
        for (let i of this.contents) {
            keys.push(i.filename);
        }
        return keys;
    }

    public remove(filename: string) {
        let index: number = -1;
        for (let i = 0; i < this.contents.length; i++) {
            if (this.contents[i].filename === filename) {
                index = i;
                break;
            }
        }

        if (index !== -1) {
            this.contents.splice(index, 1);
        }
    }
}

export function main() {
    describe('File Service', () => {
        let service: FileService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    {
                        provide: LocalStorageService,
                        useClass: MockLocalStorageService
                    },
                    FileService
                ]
            });
        });

        beforeEach(inject([FileService], (fileService: FileService) => {
            service = fileService;
        }));

        it('core functions are defined', () => {
            expect(service.exists).toBeDefined();
            expect(service.load).toBeDefined();
            expect(service.save).toBeDefined();
        });

        it('core functions should work', () => {
            // Nothing should be there initially.
            expect(service.exists('foo')).toBe(false);

            // Saving should work.
            expect(service.save('foo', 'bar')).toBe(true);
            expect(service.exists('foo')).toBe(true);
            expect(service.load('foo')).toBe('bar');

            // Overwriting should not work unless explicityl specified.
            expect(service.save('foo', 'bar')).toBe(false);
            expect(service.save('foo', 'tar', true)).toBe(true);
            expect(service.load('foo')).toBe('tar');

            // Listing all files should work.
            expect(service.ls()).toEqual(['foo']);
            expect(service.save('foo2', 'bar2')).toBe(true);
            expect(service.ls()).toEqual(['foo', 'foo2']);

            // Count should work
            expect(service.count()).toBe(2);

            service.delete('foo2');
            expect(service.count()).toBe(1);
        });
    });
}
