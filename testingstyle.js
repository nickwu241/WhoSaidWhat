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

app.get('/transcript', (req, res) => {
    res.json({
        transcript: [
            ['Jimmy', 'hi everyone', '12:25:20'],
            ['Jimmy', 'no its not the end of the world!', '12:25:57'],
            ['Sorina', 'hi my name is Sorina, I love to eat food.', '12:26:35'],
            ['Unknown', 'I supposed to know who you are', '12:26:35'],
            ['MickyMouse', 'Hi', '23:22:22']
        ],
        currentSpeaker: 'MickeyMouse'
    })
})

app.listen(process.env.PORT || 8080, () => {
    console.log(`server up on port ${port}`);
});