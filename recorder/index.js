// var record = require('node-record-lpcm16')
// var fs = require('fs')

// var file = fs.createWriteStream('output.wav', { encoding: 'binary' })

// record.start({
//   sampleRateHertz: 16000,
//   threshold: 0,
//   // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//   verbose: true,
//   recordProgram: 'sox', // Try also "arecord" or "sox"
//   silence: '10.0',
// }).pipe(file)

// // Stop recording after three seconds
// setTimeout(function () {
//   record.stop()
// }, 5000);

const { exec } = require('child_process');
exec('sox -b 16 -r 16k -c 1 -d ./nick_test.wav trim 0 2 && ../Identification/IdentifyFile.py nick_test.wav True 03f5cadf-309f-4228-8390-05007eb83ece 5d545b81-a3d9-4ea7-be55-aba94c7c1a05 cd74bc8f-71c5-46cf-82d6-9f3f30dadc30 157e954b-6fe7-4d96-a9ac-f1135521e9fa', (err, stdout, stderr) => {


  // if (err) {
  //   // node couldn't execute the command
  //   return;
  // }

  // the *entire* stdout and stderr (buffered)
  // console.log(`stdout: ${stdout}`);

  var lines = stdout.split('\n')
  var speakerId = lines[0].split('=')[1].trim()
  var confidence = lines[1].split('=')[1].trim()
  console.log(speakerId, confidence)
  // console.log(`stderr: ${stderr}`);
});