# node-lunaHook
### 👀 lunaHook for nodejs
> <a href="https://github.com/HIllya51/LunaHook" style="color:#00CDCD">LunaTextractor</a> is an open-source x86/x64 text hooker for Windows support almost visual novel games
### 👓 Requirements
> * ✅ LunaHook ver 3.2.1
>
>
> * ✅ Need files include
```
LunaHost64.dll
LunaHost32.dll
LunaHook64.dll
LunaHook32.dll
LunaHostCLI64.exe / LunaHostCLI32.exe
```
### 📜 Example
```
import LunaHookTextractor from "./yuji";
//process pid
const PID = 16064
let textractor = new LunaHookTextractor('../unaTextractor/LunaHostCLI64.exe');
textractor.on('output', output => {
    console.log(`[${output.handle}]: ${output.text}`)
})
textractor.start()
textractor.attach(PID)
```
#### ✏️ TextOutputObject
```
{
  handle: number; // hook index
  pid: number; // process ID
  addr: number; // hook address
  ctx: number; // hook context
  ctx2: number; // hook context 2
  name: string; // hook name
  code: string; // hook code
  text: string; // output text
}
```
### 🔑 API
---
### 💡 LunaHookTextractor(path: string)
The constructor.  
##### Params  
&nbsp;&nbsp; `Path` to LunaHostCLI64/32.exe
##### start(): void
&nbsp;&nbsp; Start LunaHook process.

### 💡 attach (pid: number): void
 Attach text hooker to a specific process.
##### Params
 &nbsp;&nbsp;`pid` - Process ID
##### Throws
 &nbsp;&nbsp;RangeError if pid is invalid  

 &nbsp;&nbsp;ReferenceError if Textractor process is not started
### 💡 detach(pid: number): void
Detach text hooker to a specific process.
##### Params
&nbsp;&nbsp;`pid` - Process ID

##### Throws
&nbsp;&nbsp; ReferenceError if the process has not been attached

### 💡 hook(pid: number, code: string): void
 Inject a hook into a specific process.
 Supports /H hook code and /R read code.  
##### Params  
&nbsp;&nbsp; `pid` - Process ID
##### Throws
 &nbsp;&nbsp;ReferenceError if LunaHook process is not started  
 &nbsp;&nbsp;ReferenceError if the process has not been attached  
 &nbsp;&nbsp;SyntaxError if code is invalid

### 🔋 on(event: "output", listener: (output: TextOutputObject) => void): this
Specify callback function when text outputs.
##### Params
&nbsp;&nbsp;`event`  - Must be "output"  
&nbsp;&nbsp;`listener` - The callback function
### 💡 exec(command: string): void
&nbsp;&nbsp; Execute a command manually.
##### Params
&nbsp;&nbsp;`command` - The command to execute
##### Throws
&nbsp;&nbsp;ReferenceError if LunaHook process is not started
### 💡 stop(): void
&nbsp;&nbsp;Stop LunaHook process.
### 🚪 License
## MIT
