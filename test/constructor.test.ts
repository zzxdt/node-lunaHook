import LunaHookTextractor from '../src'
exports.expectedAbsolutePath = "D:\\work\\YUKI\\lunaTextractor\\LunaHostCLI64.exe"
exports.validAbsolutePath = "D:/work/YUKI/lunaTextractor/LunaHostCLI64.exe"
exports.validRelativePath = "../../lunaTextractor/LunaHostCLI64.exe"
describe("#LunaHookTextractor", () => {
    it('test accepts absolute path', () => {
        let lunaTextractor = new LunaHookTextractor(exports.validAbsolutePath)
        expect(lunaTextractor.path).toEqual(exports.expectedAbsolutePath)
    })
    it('test accepts relative path', () => {
        let lunaTextractor = new LunaHookTextractor(exports.validRelativePath)
        expect(lunaTextractor.path).toEqual(exports.expectedAbsolutePath)
    })
})