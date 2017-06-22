import { Injectable } from '@angular/core';
import { TestBed, inject, async } from '@angular/core/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { BoardExplorerService } from './board-explorer.service';


export function main() {
    describe('Board Explorer Service', () => {
        let service: BoardExplorerService;
        let backend: MockBackend;

        let mockContent = {
            'title': 'Mock board',
            'views': {
                'front': {
                    'image': 'mock_image.svg',
                    'components': {
                        'C1': {
                            'name': 'C1 name',
                            'description': 'C1 desc',
                            'keywords': ['k1', 'k2'],
                            'pins': {
                                '1': {
                                    'name': 'C1 pin 1 name',
                                    'description': 'C1 pin 1 desc',
                                    'keywords': ['k3', 'k4']
                                }
                            }
                        }
                    }
                }
            }
        };


        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [
                    MockBackend,
                    BaseRequestOptions,
                    {
                        provide: Http,
                        useFactory: (
                            backendInstance: MockBackend,
                            defaultOptions: BaseRequestOptions) => {
                            return new Http(backendInstance, defaultOptions);
                        },
                        deps: [MockBackend, BaseRequestOptions]
                    },
                    BoardExplorerService
                ]
            });
        });

        beforeEach(inject(
            [BoardExplorerService, MockBackend],
            (boardExplorerService: BoardExplorerService, mockBackend: MockBackend) => {
            service = boardExplorerService;
            backend = mockBackend;

            backend.connections.subscribe((connection: MockConnection) => {
                let options: ResponseOptions = null;

                if (/json$/.test(connection.request.url)) {
                    options = new ResponseOptions({
                        body: JSON.stringify(mockContent)
                    });
                } else if (/md$/.test(connection.request.url)) {
                    options = new ResponseOptions({
                        body: 'Mock docs'
                    });
                }
                connection.mockRespond(new Response(options));
            });
        }));

        it('listBoards should work', () => {
            expect(service.listBoards().length).toBe(6);
        });

        it('getBoardTitle should work', async(() => {
            service.getBoardTitle('mock_board').subscribe((title: string) => {
                expect(title).toBe('Mock board');
            });
        }));

        it('getBoardImage should work', async(() => {
            service.getBoardImage('mock_board').subscribe((image: string) => {
                expect(image).toBe('assets/boards/mock_board/mock_image.svg');
            });
        }));

        it('getBoardDocs should work', async(() => {
            service.getBoardDocs('mock_board').subscribe((docs: string) => {
                expect(docs).toBe('Mock docs');
            });
        }));

        it('getComponentName should work', async(() => {
            service.getComponentName('mock_board', 'C1').subscribe((name: string) => {
                expect(name).toBe('C1 name');
            });

            service.getComponentName('mock_board', 'C1Pin1').subscribe((name: string) => {
                expect(name).toBe('C1 pin 1 name');
            });
        }));

        it('getComponentDescription should work', async(() => {
            service.getComponentDescription('mock_board', 'C1').subscribe((desc: string) => {
                expect(desc).toBe('C1 desc');
            });

            service.getComponentDescription('mock_board', 'C1Pin1').subscribe((desc: string) => {
                expect(desc).toBe('C1 pin 1 desc');
            });
        }));

        it('getComponentKeywords should work', async(() => {
            service.getComponentKeywords('mock_board', 'C1').subscribe((keywords: string[]) => {
                expect(keywords).toEqual(['k1', 'k2']);
            });

            service.getComponentKeywords('mock_board', 'C1Pin1').subscribe((keywords: string[]) => {
                expect(keywords).toEqual(['k3', 'k4']);
            });
        }));

        it('getComponentDocs should work', async(() => {
            service.getComponentDocs('mock_board', 'C1').subscribe((docs: string) => {
                expect(docs).toBe('Mock docs');
            });
        }));

    });
}
