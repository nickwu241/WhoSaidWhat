var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");


const app = express();


var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded ({
    extended: true
}));
app.use(bodyParser.json())

app.use('/assets', express.static(__dirname + '/assets'));

const port = process.env.port || 8080;
var tra = '';
var na = '';
var url;
var name;
var userId;

function sendRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => {
        data = json[Math.floor(Math.random() * 100) + 1 ];

        if (data.userId == 1){
            color = '#8e6c88';
        } else if (data.userId == 2){
            color = '#63c7b2';
        } else if (data.userId == 3){
            color = '#80ced7';
        } else {
            color = '#ccdbdc';
        }

        if (userId == ''){
            userId = data.userId;
            tra += '<div style="display: inline-block; padding:10px; margin:10px; border-radius:30px; background-color:' + color + ';">' + data.userId + ': ' + data.title;
        }
        else if (userId != data.userId){
            userId = data.userId;
            tra +=  '</div>'
            tra += '<div style="display: inline-block; padding:10px; margin:10px; border-radius:30px; background-color:' + color + ';">' + data.userId + ': ' + data.title;
        } else {
            tra += data.title;
        }
        
        if (data.userId == 1){
            url = './assets/mick.jpeg';
            name = 'Mickey Mouse';
        } else if (data.userId == 2) {
            url = './assets/3.png';
            name = 'Guy 1';
        } else if (data.userId == 3) {
            url = './assets/6.png';
            name = 'Guy 2';
        } else {
            url = './assets/first.png';
            name = 'Guy 3';
        }
        
        na = '<div id="talker"> \
              <div style="width:300px;height:300px;border-radius:50px; \
              background-image:url('+ url +'); \
              background-position: center; background-size: cover;"></div>'
              + name + ' is speaking</div> '   
        
    })
}

app.get('/', (req, res) => {
    res.render('index.hbs', {
        transcript: tra,
        name: na
	});
});


app.post('/', (req, res) => {
    var name = req.body.name;
    console.log(req.body);
    res.json({ status: 'ok' });
})


app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    setInterval(sendRequest, 100)
    
});