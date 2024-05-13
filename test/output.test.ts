import LunaHookTextractor from '../src'
const validRelativePath = require('./constructor.test').validRelativePath;
describe("#output", () => {
    it('outputs correct object when data arrives', done => {
        let textractor = new LunaHookTextractor(validRelativePath);
        textractor.on('output', output => {
            expect(output.handle).toEqual(5);
            expect(output.pid).toEqual(6);
            expect(output.addr).toEqual(8);
            expect(output.ctx).toEqual(7);
            expect(output.ctx2).toEqual(31);
            expect(output.name).toEqual("SomeName");
            expect(output.text).toEqual("「とある有名お風呂」");
            done();
        });
        textractor.onData("[5:6:8:7:1F:SomeName] 「とある有名お風呂」");
    });
    describe("#output", () => {
        it("outputs correct object when multiple line data arrives", done => {
            const t = new LunaHookTextractor(validRelativePath);
            let times = 0;
            t.on("output", output => {
                times++;
                if (times < 3) return;
                expect(output.handle).toEqual(0x17);
                expect(output.pid).toEqual(0x3388);
                expect(output.addr).toEqual(0x67A78E);
                expect(output.ctx).toEqual(0);
                expect(output.ctx2).toEqual(0x19F95C);
                expect(output.name).toEqual("System43");
                expect(output.text).toEqual(
                    "わずかな灯りに照らされた道の真ん中で、わずかな灯りに照らされた道の真ん中で、" +
                    "わずかな灯りに照らされた道の真ん中で、大柄の男が、ずぶ濡れで立っていた。"
                );
                done();
            });
            t.onData("[17:3388:67A78E:0:19F95C:System43:HSN4:-14@27A78E:Haharanman.exe] " +
                "わずかな灯りに照らされた道の真ん中で、わずかな灯りに照らされた道の真ん中で、");
            t.onData("わずかな灯りに照らされた道の真ん中で、");
            t.onData("大柄の男が、ずぶ濡れで立っていた。");
        });

        it("outputs correct object in the end when multiple line data arrives and first line is empty", done => {
            const t = new LunaHookTextractor(validRelativePath);
            let times = 0;
            t.on("output", output => {
                times++;
                if (times < 2) return;
                expect(output.handle).toEqual(0x17);
                expect(output.pid).toEqual(0x3388);
                expect(output.addr).toEqual(0x67A78E);
                expect(output.ctx).toEqual(0);
                expect(output.ctx2).toEqual(0x19F95C);
                expect(output.name).toEqual("System43");
                expect(output.text).toEqual("わずかな灯りに照らされた道の真ん中で、");
                done();
            });
            t.onData("[17:3388:67A78E:0:19F95C:System43:HSN4:-14@27A78E:Haharanman.exe] ");
            t.onData("わずかな灯りに照らされた道の真ん中で、");
        });

        it("does not output anything if non-data arrives", done => {
            const t = new LunaHookTextractor(validRelativePath);
            let somethingOutput = false;
            t.on("output", () => {
                somethingOutput = true;
            });
            t.onData("Usage: {'attach'|'detach'|hookcode} -Pprocessid");
            setTimeout(() => {
                expect(somethingOutput).toBeFalsy();
                done();
            }, 100); // Using setTimeout to ensure all async events are processed
        });
    });
})