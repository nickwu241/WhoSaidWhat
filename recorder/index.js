var record = require('node-record-lpcm16')
var fs = require('fs')

var file = fs.createWriteStream('output.wav', { encoding: 'binary' })

record.start({
    sampleRateHertz: 16000,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: true,
    recordProgram: 'sox', // Try also "arecord" or "sox"
    silence: '10.0',
}).pipe(file)

// Stop recording after three seconds
setTimeout(function () {
  record.stop()
}, 5000);