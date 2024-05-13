import LunaHookTextractor from '../src';
const validRelativePath = require('./constructor.test').validRelativePath;
const processPID = 16064
describe("#LunaHookTextractor", () => {
    it("should extract text from a given file", done => {
        let textractor = new LunaHookTextractor(validRelativePath)
        let outputCount = 0;  // track the event 
        const expectedOutputs = 1;  //expect output
        textractor.on('output', output => {
            console.log(`[${output.handle}]: ${output.text}`)
            outputCount++;
            if (outputCount === expectedOutputs) {
                done();
            }
        })
        textractor.start()
        textractor.attach(processPID)
    })
})