import { resolve } from 'path'
import { spawn, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'
import scanf from 'scanf'
const Split = require('split');
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
    public path: string;
    public process?: ChildProcess;
    public splitStream: any;
    public attachedPids: number[] = [];
    // LunaHook for textractor
    public textOutputObject: LunaTextOutputObject = {
        handle: -1,
        pid: -1,
        addr: -1,
        ctx: -1,
        ctx2: -1,
        name: "",
        code: "",
        text: ""
    };
    constructor(path: string) {
        super()
        this.path = resolve(__dirname, path)
        this.splitStream = Split();
        this.splitStream.on("data", this.onData.bind(this));
    }
    // Start LunahookTextractor process
    start(): void {
        if (this.process) {
            return;
        }
        this.process = spawn(this.path, {
            stdio: ["pipe", "pipe", "ignore"]
        });
        this.process.stdout?.setEncoding("utf16le");
        this.process.stdout?.pipe(this.splitStream);
        this.process.on("error", (error: Error) => {
            console.error("error:", error);
        });
    }
    // Attach text hooker to a specific process.
    // need pid of the process
    attach(pid: number): void {
        if (!this.process) {
            throw new ReferenceError("Textractor not started");
        }
        this.ensurePidValid(pid);
        if (this.attachedPids.includes(pid)) {
            return;
        }
        this.exec(`attach -P${pid}`);
        this.attachedPids.push(pid);
    }
    // Detach text hooker to a specific process.
    detach(pid: number): void {
        this.ensureProcessAttached(pid);
        this.exec(`detach -P${pid}`);
    }
    // Inject a hook into a specific process.
    // Supports __/H__ hook code and __/R__ read code.
    hook(pid: number, code: string): void {
        if (!this.process) {
            throw new ReferenceError("LunaTextractor not started");
        }
        this.ensureProcessAttached(pid);
        if (!code.includes("/H") && !code.includes("/R")) {
            throw new SyntaxError("invalid code");
        }
        this.exec(`${code} -P${pid}`);
    }

    exec(command: string): void {
        if (!this.process) {
            throw new ReferenceError("Textractor not started");
        }
        this.process.stdin?.write(Buffer.from(command + "\n", "utf16le"));
    }

    stop(): void {
        if (!this.process) {
            return;
        }
        this.process.kill();
        this.process = undefined;
    }
    private ensurePidValid(pid: number): void {
        if (pid < 0 || pid > 65535) {
            throw new RangeError("invalid process ID");
        }
    }

    private ensureProcessAttached(pid: number): void {
        if (!this.attachedPids.includes(pid)) {
            throw new ReferenceError("process has not been attached");
        }
    }

    public onData(line: string): void {
        if (line.startsWith("Usage")) {
            return;
        }
        // Handle multiple lines
        if (line.startsWith("[")) {
            this.textOutputObject = scanf.sscanf(line, "[%x:%x:%x:%x:%x:%s:%s] %S", "handle", "pid", "addr", "ctx", "ctx2", "name", "code", "text");
            // In case of hook code doesn't exist
            if (this.textOutputObject.name.endsWith(']')) {
                this.textOutputObject.name = this.textOutputObject.name.slice(0, -1);
                this.textOutputObject.text = this.textOutputObject.code;
                this.textOutputObject.code = "";
            }
        } else {
            const text: string = scanf.sscanf(line, "%S");
            this.textOutputObject.text += text;
        }
        if (this.textOutputObject.text === null) {
            this.textOutputObject.text = "";
        }
        this.emit("output", this.textOutputObject);
    }
}
