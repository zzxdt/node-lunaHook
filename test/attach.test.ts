import LunaHookTextractor from '../src'
const validRelativePath = require('./constructor.test').validRelativePath
const attachPid: number = 9999999
describe('#attach', () => {
    it("throws RangeError if pid is invalid", () => {
        let lunaTextractor = new LunaHookTextractor(validRelativePath);
        lunaTextractor.start();
        expect(() => lunaTextractor.attach(-1)).toThrow(RangeError);
        expect(() => lunaTextractor.attach(attachPid)).toThrow(RangeError);
    })
})