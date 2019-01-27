const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'Encoding of the audio file, e.g. LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'BCP-47 language code, e.g. en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

// Create a recognize stream
const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : `\n\nReached transcription time limit, press Ctrl+C\n`
    )
  );

// Start recording and send the microphone input to the Speech API
record
  .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');

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