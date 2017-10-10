export interface WebUsbPortInterface {
    onReceive(data: string): void;
    onReceiveError(error: DOMException): void;

    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    isAshellReady(): boolean;
    read(): Promise<string>;
    send(data: string): Promise<string>;
    save(filename: string, data: string, throttle: boolean): Promise<string>;
    run(data: string, throttle: boolean): Promise<string>;
    stop(): Promise<string>;
}
