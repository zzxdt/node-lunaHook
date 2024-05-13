import LunaHookTextractor from '../src';
const validRelativePath = require('./constructor.test').validRelativePath;

describe('#exec', () => {
    it('throws ReferenceError if LunaTextractor process is not started', () => {
        const textractor = new LunaHookTextractor(validRelativePath);
        expect(() => textractor.exec("attach -P0")).toThrow(ReferenceError);
    })
})