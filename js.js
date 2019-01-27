var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");
const { exec } = require('child_process');



// Import stdlib
const lib = require('lib');
const sms = lib.utils.sms['@1.0.9'];

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

const sheets = require('./sheets.js');

// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const app = express();
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/static'));

const port = process.env.port || 8080;
var transcript = [];
var transcriptText = '';
var speakerName = 'No one';
var previousSpeakerName = '';
var previousTranscription = '';
var globalId = 0;
var isEnrolling = false;

function stdlib_call(speakerName, text) {
    lib['nickwu241.who-said-what'](speakerName, text, (err, res) => {
        if (err) {
            console.error('stdlib function call error:', err);
        } else {
            console.log('stdlib function call succeeded');
        }
    });
}

function sendRequest() {
    fetch('https://jsonplaceholder.typicode.com/todos/')
        .then(response => response.json())
        .then(json => {
            data = json[Math.floor(Math.random() * 100) + 1];
            transcript += data.title;
            speakerName = data.userId;
        })
}

function transcribe(filename, speakerId) {
    const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: languageCode,
    };
    const audio = {
        content: fs.readFileSync(filename).toString('base64'),
    };

    const request = {
        config: config,
        audio: audio,
    };

    // Detects speech in the audio file
    // const [response] = await client.recognize(request);
    client.recognize(request).then(r => {
        const [response] = r
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: `, transcription);
        // console.log(transcript)
        if (previousSpeakerName === speakerId) {
            // Keep speech buble.
            transcript[transcript.length - 1][1] += transcription + " "
        } else {
            // Create new speech buble.
            if (transcript.length > 0) {
                // console.log(previousSpeakerName)
                // console.log(transcript)
                // TODO: This is hacky, fix later
                if (previousTranscription != transcription)
                    stdlib_call.apply(previousSpeakerName, transcript[transcript.length - 1]);
            }
            if (transcription.length > 0) {
                var date = new Date();
                var timestamp = date.toTimeString().split(' ')[0]
                console.log(timestamp)
                transcript.push([speakerId, transcription, timestamp])
            }

        }

        if (transcription.contains('unlock') && speakerId === 'Jimmy') {
            sms();
        }

        if (isEnrolling) {
            return;
        }

        transcriptText += transcription;
        speakerName = speakerId;
        previousSpeakerName = speakerId;
        previousTranscription = transcription;
    }).catch(err =>
        console.error(err))
}

function exec_commands(cmd_record, cmd_identify) {
    exec(cmd_record, (err, stdout, stderr) => {
        if (err) {
            console.error('couldnt execute command', err);
            throw err;
        }
        if (isEnrolling) {
            return;
        }

        getSpeakerId();
        console.log('identity command', cmd_identify);
        exec(cmd_identify, (err1, stdout1, stderr1) => {
            if (err1) {
                console.error('couldnt execute command', err1);
                throw err1;
            }
            console.log(`stdout: ${stdout1}`);
            console.log(`stderr: ${stderr1}`);
            var lines = stdout1.split('\n')
            var speakerId = lines[0].split('=')[1].trim()
            var confidence = lines[1].split('=')[1].trim()
            transcribe(filename, speakerId);
        });
    })
}

function getSpeakerId() {
    enroll_time = 4
    console.log("listening to user voice")
    filename = `output_${globalId}.wav`
    globalId++
    cmd_record = `sox -b 16 -r 16k -c 1 -d ${filename} trim 0 ${enroll_time}`
    cmd_identify = `./Identification/IdentifyFile.py ${filename} True`
    exec_commands(cmd_record, cmd_identify);
}

function enroll(name, callback) {
    enroll_time = 15
    console.log("Enrolling... ", name)
    cmd_create = '(prof_id=$(./Identification/CreateProfile.py); ./Identification/EnrollProfile.py ${prof_id} enroll.wav True ' + name + ')'
    cmd_enroll = `sox -b 16 -r 16k -c 1 -d enroll.wav trim 0 ${enroll_time} && ${cmd_create}`
    exec(cmd_enroll, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        callback();
    });
}

function sms() {
    var number = '7783165948';
    var text = 'Door unlocked.';
    sms({
        to: number, // (required)
        body: text // (required)
    });
}

// app.get('/', (req, res) => {
//     res.render('index.hbs', {
//         transcript: transcriptText,
//         name: speakerName
//     });
// });
// app.get('/transcript', (req, res) => {
//     res.json({ transcript: [['Hello', 'World']], currentSpeaker: 'Jimmy' })
// })



app.post('/speakerId', (req, res) => {
    getSpeakerId();
    res.json({ status: 'ok' });
})

app.post('/create/:name', (req, res) => {
    isEnrolling = true;
    enroll(req.params.name, () => {
        isEnrolling = false;
        getSpeakerId();
        res.json({ status: 'ok' })
    });
})

app.get('/transcript', (req, res) => {
    res.json({
        transcript: transcript,
        currentSpeaker: speakerName
    });
})

app.post('/export', (req, res) => {
    sheets.writeToSheets(transcript);
    res.json({ statis: 'ok' });
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    getSpeakerId();
});
