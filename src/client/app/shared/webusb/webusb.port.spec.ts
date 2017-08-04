import { WebUsbPort } from './webusb.port';


class MockUSBDevice {
    // Mock native properties

    public opened: boolean = false;
    public configuration: any = null;


    // Mock native methods

    public transferIn = jasmine.createSpy('transferIn')
    .and.callFake(() => {
        return new Promise<any>((resolve, reject) => {
            if (this.opened) {
                // Fake a little delay
                setTimeout(() => {
                    resolve({data: 'test'});
                }, 100);
            } else {
                reject();
            }
        });
    });

    public selectConfiguration = jasmine.createSpy('selectConfiguration')
    .and.callFake(() => {
        this.configuration = {};
    });

    public claimInterface = jasmine.createSpy('claimInterface')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            if (!this._claimed) {
                this._claimed = true;
                resolve();
            } else {
                reject();
            }
        });
    });

    public controlTransferOut = jasmine.createSpy('controlTransferOut')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            if (this.opened) {
                resolve();
            } else {
                reject();
            }
        });
    });

    public transferOut = jasmine.createSpy('transferOut')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            if (this.opened) {
                resolve();
            } else {
                reject();
            }
        });
    });

    public open = jasmine.createSpy('open')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            if (!this.opened) {
                this.opened = true;
                resolve();
            } else {
                reject();
            }
        });
    });

    public releaseInterface = jasmine.createSpy('releaseInterface')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    });

    public close = jasmine.createSpy('close')
    .and.callFake(() => {
        return new Promise<void>((resolve, reject) => {
            this.opened = false;
            resolve();
        });
    });


    // Fake internal properties needed for the mock

    private _claimed: boolean = false;
}


export function main() {
    describe('WebUsb Port', () => {
        let port: WebUsbPort;
        let mockDevice: MockUSBDevice;

        beforeEach(() => {
            mockDevice = new MockUSBDevice();
            port = new WebUsbPort(mockDevice);

            port.decoder.decode = jasmine.createSpy('decode')
            .and.callFake((s: string): string => { return s; });

            port.encoder.encode = jasmine.createSpy('encode')
            .and.callFake((s: string): string => { return s; });

            (port as any).convIHex = jasmine.createSpy('convIHex')
            .and.callFake((s: string): string => { return s; });
        });

        afterEach(() => {
            mockDevice = undefined;
            port = undefined;
        });

        it('connect should work', done => {
            port.onReceive = (data) => {
                expect(data).toBe('test');
                done();
            };

            port.connect().then(() => {
                // A second connect will fail because the interface cannot be
                // claimed.
                port.connect().then(function() {
                    // Promise is resolved
                    done.fail('Promise should not be resolved');
                }, function(reason) {
                    done();
                });
            });
        });


        it('sudden disconnection should be detected', done => {
            let originalSpy = mockDevice.transferIn;

            port.onReceiveError = (error: DOMException) => {
                mockDevice.transferIn = originalSpy;
                done();
            };

            mockDevice.transferIn = jasmine.createSpy('transferIn').and.callFake(() => {
                return new Promise<void>((resolve, reject) => {
                    setTimeout(() => {
                        reject();
                    }, 100);
                });
            });

            port.connect();
        });

        it('disconnect should work', done => {
            port.connect().then(() => {
                port.disconnect().then(() => {
                    done();
                });
            });
        });

        it('isConnected should work', done => {
            port.connect().then(() => {
                expect(port.isConnected()).toBe(true);
                port.disconnect().then(() => {
                    expect(port.isConnected()).toBe(false);
                    done();
                });
            });
        });

        it('read should work', done => {
            port.connect().then(() => {
                port.read().then((result: string) => {
                    expect(result).toBe('test');
                    done();
                });
            });
        });

        it('send should work', done => {
            port.connect().then(() => {
                port.send('foo').then((result: string) => {
                    done();
                });
            });
        });

        it('run should work', done => {
            port.connect().then(() => {
                port.run('foo()', true).then((result: string) => {
                    expect(result).toBe(undefined); // no warning
                    done();
                });
            });
        });

        it('stop should work', done => {
            port.connect().then(() => {
                port.run('foo()', true).then(() => {
                    port.stop().then(() => done());
                });
            });
        });

        it('save should work', done => {
            port.connect().then(() => {
                port.save('foo.txt', 'foo', true).then((result: string) => {
                    expect(result).toBe(undefined); // no warning
                    done();
                });
            });
        });
    });
}
