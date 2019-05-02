const express = require('express');
const app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/static'));

const port = process.env.port || 8080;

const initialTranscript = [
    ['Jimmy', 'hi everyone', '12:25:20'],
    ['Jimmy', 'no its not the end of the world!', '12:26:27'],
    ['Sorina', 'hi my name is Sorina, I love to eat food', '12:26:32'],
    ['Unknown', 'I am supposed to know who you are', '12:26:35'],
    ['Jimmy', 'what should we talk about today?', '12:26:41'],
    ['MickeyMouse', 'hi fellows, I am Mickey Mouse', '12:26:46']
]
let transcript = [...initialTranscript]
let currentSpeaker = 'No one'

app.get('/transcript', (req, res) => {
    res.json({
        transcript: transcript,
        currentSpeaker: currentSpeaker
    })
})

function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}

function speakEvent(speaker, delayTime, transcriptLine) {
    currentSpeaker = speaker
    return delay(delayTime).then(() => {
        if (transcriptLine !== undefined) {
            transcript.push(transcriptLine)
        }
    })
}

app.post('/start_events', (req, res) => {
    delay(0).then(() => speakEvent('Jimmy', 2000, ['Jimmy', 'hi Mickey, nice to meet you', '12:26:49']).then(
        () => delay(1000)
    ).then(
        () => speakEvent('Sorina', 1500, ['Sorina', "let's go eat food", '12:26:51'])
    ).then(
        () => delay(2000)
    ).then(
        () => speakEvent('No one', 1500)
    ).then(
        () => speakEvent('MickeyMouse', 1000, ['MickeyMouse', 'good idea, lets go', '12:26:56'])
    ).then(
        () => delay(1000)
    ).then(
        () => speakEvent('No one', 1000)
    ).then(
        () => res.json({
            status: 'ok'
        })
    ))
})

app.post('/reset', (req, res) => {
    transcript = [...initialTranscript]
    currentSpeaker = 'No one'
    res.json({
        status: 'ok'
    })
})

const sheets = require('./sheets.js');
app.post('/export', (req, res) => {
    sheets.writeToSheets(transcript);
    res.json({
        status: 'ok'
    });
});

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server up on port ${port}`);
});