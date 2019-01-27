var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");
const { exec } = require('child_process');

// Import stdlib
const lib = require('lib');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

// Creates a client
const client = new speech.SpeechClient();

// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const app = express();

const port = process.env.port || 8080;
var transcript = '';
var speakerName = 'No one';
var previousSpeakerName = '';
var globalId = 0;

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

async function transcribe(filename, speakerId) {
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
        console.log(response);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: `, transcription);
        if (previousSpeakerName === speakerId) {
            // Keep speech buble.
            transcript += transcription;
        } else {
            // Create new speech buble.
            transcript += transcription;
            stdlib_call(previousSpeakerName, transcription);
        }
        speakerName = speakerId;
        previousSpeakerName = speakerId;
    });
}

function exec_commands(cmd_record, cmd_identify) {
    exec(cmd_record, (err, stdout, stderr) => {
        if (err) {
            console.error('couldnt execute command', err);
            throw err;
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
    console.log("listening to user voice")
    filename = `output_${globalId}.wav`
    globalId++
    cmd_record = `sox -b 16 -r 16k -c 1 -d ${filename} trim 0 6`
    cmd_identify = `./Identification/IdentifyFile.py ${filename} True 03f5cadf-309f-4228-8390-05007eb83ece 5d545b81-a3d9-4ea7-be55-aba94c7c1a05 cd74bc8f-71c5-46cf-82d6-9f3f30dadc30 157e954b-6fe7-4d96-a9ac-f1135521e9fa`
    exec_commands(cmd_record, cmd_identify);
}

function enroll(name) {
    console.log("Enrolling... ", name)
    cmd_create = '(prof_id=$(./Identification/CreateProfile.py); ./Identification/EnrollProfile.py ${prof_id} enroll.wav True ' + name
    cmd_enroll = `sox -b 16 -r 16k -c 1 -d enroll.wav trim 0 10 && ${cmd_create}`
    exec(cmd_enroll, (err, stdout, stderr) => {
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
}

app.get('/', (req, res) => {
    res.render('index.hbs', {
        transcript: transcript,
        name: speakerName
    });
});

app.post('/speakerId', (req, res) => {
    getSpeakerId();
    res.json({ status: 'ok' });
})

app.post('/create/:name', (req, res) => {
    enroll(req.params.name);
    res.json({ status: 'ok' })
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    // setInterval(getSpeakerId, 10000)
    // getSpeakerId();
});
