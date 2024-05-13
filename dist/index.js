"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const child_process_1 = require("child_process");
const events_1 = require("events");
const scanf = require('scanf');
const Split = require('split');
class LunaHookTextractor extends events_1.EventEmitter {
    constructor(path) {
        super();
        this.attachedPids = [];
        // LunaHook for textractor
        this.textOutputObject = {
            handle: -1,
            pid: -1,
            addr: -1,
            ctx: -1,
            ctx2: -1,
            name: "",
            code: "",
            text: ""
        };
        this.path = (0, path_1.resolve)(__dirname, '..', path);
        this.splitStream = Split();
        this.splitStream.on("data", this.onData.bind(this));
    }
    // Start LunahookTextractor process
    start() {
        var _a, _b;
        if (this.process) {
            return;
        }
        this.process = (0, child_process_1.spawn)(this.path, {
            stdio: ["pipe", "pipe", "ignore"]
        });
        (_a = this.process.stdout) === null || _a === void 0 ? void 0 : _a.setEncoding("utf16le");
        (_b = this.process.stdout) === null || _b === void 0 ? void 0 : _b.pipe(this.splitStream);
        this.process.on("error", (error) => {
            console.error("error:", error);
        });
    }
    // Attach text hooker to a specific process.
    // need pid of the process
    attach(pid) {
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
    detach(pid) {
        this.ensureProcessAttached(pid);
        this.exec(`detach -P${pid}`);
    }
    // Inject a hook into a specific process.
    // Supports __/H__ hook code and __/R__ read code.
    hook(pid, code) {
        if (!this.process) {
            throw new ReferenceError("Textractor not started");
        }
        this.ensureProcessAttached(pid);
        if (!code.includes("/H") && !code.includes("/R")) {
            throw new SyntaxError("invalid code");
        }
        this.exec(`${code} -P${pid}`);
    }
    exec(command) {
        var _a;
        if (!this.process) {
            throw new ReferenceError("Textractor not started");
        }
        (_a = this.process.stdin) === null || _a === void 0 ? void 0 : _a.write(Buffer.from(command + "\n", "utf16le"));
    }
    stop() {
        if (!this.process) {
            return;
        }
        this.process.kill();
        this.process = undefined;
    }
    ensurePidValid(pid) {
        if (pid < 0 || pid > 65535) {
            throw new RangeError("invalid process ID");
        }
    }
    ensureProcessAttached(pid) {
        if (!this.attachedPids.includes(pid)) {
            throw new ReferenceError("process has not been attached");
        }
    }
    onData(line) {
        if (line.startsWith("Usage")) {
            return;
        }
        if (line.startsWith("[")) {
            this.textOutputObject = scanf.sscanf(line, "[%x:%x:%x:%x:%x:%s:%s] %S", "handle", "pid", "addr", "ctx", "ctx2", "name", "code", "text");
            if (this.textOutputObject.name.endsWith(']')) {
                this.textOutputObject.name = this.textOutputObject.name.slice(0, -1);
                this.textOutputObject.text = this.textOutputObject.code;
                this.textOutputObject.code = "";
            }
        }
        else {
            const text = scanf.sscanf(line, "%S");
            this.textOutputObject.text += text;
        }
        if (this.textOutputObject.text === null) {
            this.textOutputObject.text = "";
        }
        this.emit("output", this.textOutputObject);
    }
}
exports.default = LunaHookTextractor;
