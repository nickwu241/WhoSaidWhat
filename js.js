var http = require('http');
var fs = require('fs');
var hbs = require('hbs');
const express = require('express');
const fetch = require("node-fetch");

const app = express();


const port = process.env.port || 8080;
var data = {};

function sendRequest(){
    fetch('https://jsonplaceholder.typicode.com/todos/')
    .then(response => response.json())
    .then(json => {
        data = json[Math.floor(Math.random() * 100) + 1 ] 
    })
}

app.get('/', (req, res) => {
    res.render('index.hbs', {
        transcript: data.title,
        name: data.userId
	});
});


app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`)
    setInterval(sendRequest, 100)
    
});