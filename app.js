const express = require('express')
const socket = require('socket.io');
const app = express()

const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path")

const { authJWT } = require('./app/middleware/middleware');
const { botReply } = require('./app/controller/botMsg');
// const { botReply } = require('./app/controller/botMsg');

require("dotenv").config({ path: __dirname + '/.env' });

app.use(express.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(authJWT)

require('./app/router/user')(app);
require('./app/router/auth')(app);
require('./app/router/botMsg')(app)

app.get('*', (req, res) => {
    res.status(400).send({
        error: true,
        message: 'Hunn Smart!'
    })
});



const PORT = process.env.PORT || 5200


const server = app.listen(PORT, () => console.log(`Server is running port on ${PORT}`))
const io = socket(server);

io.on("connection", function (socket) {

    socket.on('clientMessage', (msg) => {

        let serverResp = botReply(msg)

        socket.emit('serverMessage', serverResp)
    })
});