import LunaHookTextractor from '../src';
const validRelativePath = require('./constructor.test').validRelativePath;
const validHCode = "/HW-1C@C8B8:advhd.exe";
const invalidCode = "//";
describe('#hook', () => {
    it('throws ReferenceError if LunaTextractor process is not started', () => {
        let textractor = new LunaHookTextractor(validRelativePath)
        expect(() => textractor.hook(0, validHCode)).toThrow(ReferenceError)
        textractor.stop()
    })
    it("throws ReferenceError if the process has not been attached", () => {
        let textractor = new LunaHookTextractor(validRelativePath);
        textractor.start();
        expect(() => {
            textractor.hook(0, validHCode);
        }).toThrow(ReferenceError)
        textractor.stop();
    });

    it("throws SyntaxError if code is invalid", () => {
        let textractor = new LunaHookTextractor(validRelativePath);
        textractor.start();
        textractor.attach(0);
        expect(() => {
            textractor.hook(0, invalidCode);
        }).toThrow(SyntaxError);
        textractor.stop();
    });
})