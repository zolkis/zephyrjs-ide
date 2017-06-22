import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import 'rxjs/add/operator/map';


@Injectable()
export class BoardExplorerService {
    private readonly BASE_PATH: string = 'assets/boards/';

    private _boards: string[] = [
        'arduino_101',
        'joule_570x',
        'minnowboard_turbot_B_41',
        'quark_mcu_dev_kit_c1000',
        'quark_mcu_dev_kit_d2000',
        'tinyTILE'
    ];
    private _data: any = {};


    public constructor(private http: Http) {
    }

    public listBoards(): string[] {
        return this._boards;
    }

    public getBoardTitle(path: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                observer.next(this._data[path].title);
                observer.complete();
            };

            if (this._data[path]) {
                _();
            } else {
                this._fetchJson(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getBoardImage(path: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                let image =
                    this.BASE_PATH + path + '/' +
                    this._data[path].views.front.image;
                observer.next(image);
                observer.complete();
            };

            if (this._data[path]) {
                _();
            } else {
                this._fetchJson(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getBoardDocs(path: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                observer.next(this._data[path].docs.__index__);
                observer.complete();
            };

            if (this._data[path] && this._data[path].docs && this._data[path].docs.__index__) {
                _();
            } else {
                this._fetchDocs(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getComponentName(path: string, id: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                let name: string;

                if (id.indexOf('Pin') < 0) {
                    observer.next(this._data[path].views.front.components[id].name);
                } else {
                    let component: string = id.split('Pin')[0];
                    let pin: string = id.split('Pin')[1];
                    observer.next(this._data[path].views.front.components[component].pins[pin].name);
                }

                observer.complete();
            };

            if (this._data[path]) {
                _();
            } else {
                this._fetchJson(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getComponentDescription(path: string, id: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                let desc: string;

                if (id.indexOf('Pin') < 0) {
                    observer.next(this._data[path].views.front.components[id].description);
                } else {
                    let component: string = id.split('Pin')[0];
                    let pin: string = id.split('Pin')[1];
                    observer.next(this._data[path].views.front.components[component].pins[pin].description);
                }

                observer.complete();
            };

            if (this._data[path]) {
                _();
            } else {
                this._fetchJson(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getComponentKeywords(path: string, id: string): Observable<string[]> {
        return new Observable((observer: Observer<string[]>) => {
            let _ = () => {
                let keywords: string[];

                if (id.indexOf('Pin') < 0) {
                    observer.next(this._data[path].views.front.components[id].keywords);
                } else {
                    let component: string = id.split('Pin')[0];
                    let pin: string = id.split('Pin')[1];
                    observer.next(this._data[path].views.front.components[component].pins[pin].keywords);
                }

                observer.complete();
            };

            if (this._data[path]) {
                _();
            } else {
                this._fetchJson(path).subscribe(() => {
                    _();
                });
            }
        });
    }

    public getComponentDocs(path: string, id: string): Observable<string> {
        return new Observable((observer: Observer<string>) => {
            let _ = () => {
                observer.next(this._data[path].docs[id]);
                observer.complete();
            };

            if (this._data[path] && this._data[path].docs && this._data[path].docs[id]) {
                _();
            } else {
                this._fetchDocs(path, id)
                    .catch((err: any, caught: Observable<void>): ObservableInput<{}> => {
                        if (err.status === 404) {
                            // No documentation for this component.
                        }
                        return Observable.of(false);
                    })
                    .subscribe(() => {
                        _();
                    });
            }
        });
    }

    private _fetchJson(path: string): Observable<void> {
        return this.http.get(this.BASE_PATH + path + '/board.json')
            .map((res: Response) => {
                this._data[path] = res.json();
            });
    }

    private _fetchDocs(path: string, id?: string): Observable<void> {
        if (this._data[path] === undefined) {
            this._data[path] = { docs: {}};
        }

        if (this._data[path].docs === undefined) {
            this._data[path].docs = {};
        }

        if (id !== undefined) {
            // Get a specific component
            return this.http.get(this.BASE_PATH + path + '/docs/' + id + '.md')
                .map((res: Response) => {
                    this._data[path].docs[id] = res.text();
                })
                .catch((err: any, caught: Observable<void>): ObservableInput<{}> => {
                    this._data[path].docs[id] = null;
                    return Observable.of(false);
                });
        } else {
            // Get index.md
            return this.http.get(this.BASE_PATH + path + '/index.md')
                .map((res: Response) => {
                    this._data[path].docs.__index__ = res.text();
                })
                .catch((err: any, caught: Observable<void>): ObservableInput<{}> => {
                    this._data[path].docs.__index__ = null;
                    return Observable.of(false);
                });
        }
    }
}
