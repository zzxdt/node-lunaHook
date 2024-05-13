import LunaHookTextractor from '../src'
const validRelativePath = require('./constructor.test').validRelativePath;
describe('#attach', () => {
    it('throws ReferenceError if LunaTextractor process is not started', () => {
        let textractor = new LunaHookTextractor(validRelativePath);
        expect(() => textractor.detach(0)).toThrow(ReferenceError)
    })
})