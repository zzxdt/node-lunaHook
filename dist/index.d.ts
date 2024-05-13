/// <reference types="node" />
/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
interface LunaTextOutputObject {
    handle: number;
    pid: number;
    addr: number;
    ctx: number;
    ctx2: number;
    name: string;
    code: string;
    text: string;
}
export default class LunaHookTextractor extends EventEmitter {
    path: string;
    process?: ChildProcess;
    splitStream: any;
    attachedPids: number[];
    textOutputObject: LunaTextOutputObject;
    constructor(path: string);
    start(): void;
    attach(pid: number): void;
    detach(pid: number): void;
    hook(pid: number, code: string): void;
    exec(command: string): void;
    stop(): void;
    private ensurePidValid;
    private ensureProcessAttached;
    private onData;
}
export {};
