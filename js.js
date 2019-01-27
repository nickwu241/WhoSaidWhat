var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");

const app = express();


const port = process.env.port || 8080;
var tra = '';
var na = '';

function sendRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => {
        data = json[Math.floor(Math.random() * 100) + 1 ];
        tra += data.title;
        na = data.userId;
    })
}

app.get('/', (req, res) => {
    res.render('index.hbs', {
        transcript: tra,
        name: na
	});
});


app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    setInterval(sendRequest, 1000)
    
});