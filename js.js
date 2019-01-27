var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");
const { exec } = require('child_process');

const app = express();


const port = process.env.port || 8080;
var tra = '';
var na = '';
var globalId = 0;

function sendRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => {
        data = json[Math.floor(Math.random() * 100) + 1 ];
        tra += data.title;
        na = data.userId;
    })
}

function getSpeakerId() {
    cmd = 'sox -b 16 -r 16k -c 1 -d ./nick_test.wav trim 0 2 && ./Identification/IdentifyFile.py nick_test.wav True 03f5cadf-309f-4228-8390-05007eb83ece 5d545b81-a3d9-4ea7-be55-aba94c7c1a05 cd74bc8f-71c5-46cf-82d6-9f3f30dadc30 157e954b-6fe7-4d96-a9ac-f1135521e9fa'
    exec(cmd ,(err, stdout, stderr) => {
        if (err) {
            console.error('couldnt execute command', err);
            throw err;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        var lines = stdout.split('\n')
        var speakerId = lines[0].split('=')[1].trim()
        var confidence = lines[1].split('=')[1].trim()

        tra += 'Someone said something...';
        na = speakerId;
    });
}

app.get('/', (req, res) => {
    res.render('index.hbs', {
        transcript: tra,
        name: na
	});
});

app.post('/speakerId', (req, res) => {
    cmd = 'sox -b 16 -r 16k -c 1 -d ./nick_test.wav trim 0 2 && ./Identification/IdentifyFile.py nick_test.wav True 03f5cadf-309f-4228-8390-05007eb83ece 5d545b81-a3d9-4ea7-be55-aba94c7c1a05 cd74bc8f-71c5-46cf-82d6-9f3f30dadc30 157e954b-6fe7-4d96-a9ac-f1135521e9fa'
    exec(cmd ,(err, stdout, stderr) => {
        if (err) {
            console.error('couldnt execute command', err);
            throw err;
        }
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        var lines = stdout.split('\n')
        var speakerId = lines[0].split('=')[1].trim()
        var confidence = lines[1].split('=')[1].trim()

        res.json({speakerId: speakerId, confidence: confidence});
    });

})

app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    setInterval(getSpeakerId, 4000)
});