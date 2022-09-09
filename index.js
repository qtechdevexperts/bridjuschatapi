const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const mongoose = require('mongoose')
// var fs = require('fs');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require("dotenv/config")
const authRoutes = require('./controller/auth')
const treeRoutes = require('./controller/tree')
const relativeRoutes = require('./controller/relative')
const messageRoutes = require('./controller/message')
const mediaRoutes = require('./controller/media')
const requestRoutes = require('./controller/request')

const {
    get_messages,
    send_message
} = require('./utils/messages');

const api = process.env.API_URL


app.use("/public/uploads", express.static(__dirname + "/uploads/public"));

app.use(`${api}/auth`, authRoutes)
app.use(`${api}/tree`, treeRoutes)
app.use(`${api}/relative`, relativeRoutes)
app.use(`${api}/message`, messageRoutes)
app.use(`${api}/media`, mediaRoutes)
app.use(`${api}/request`, requestRoutes)

app.get('/', (req, res) => {
    res.send(`${api}/oo`)
});

mongoose.connect(process.env.CONNECTION_STRING, {
    dbName: "Bridjus"
}).
    then(() => {
        console.log('connection success')
    })
    .catch((err) => {
        console.log(err)
    });







// sockit

// const server = require('https').createServer(options, app);
const server = require('http').createServer(app);

// var io = require('socket.io')(server, {
//     cors: {
//         origin: "*",
//     }
// });


// Run when client connects
io.on('connection', socket => {

    console.log("socket connection " + socket.id);
    socket.on('get_messages', function (object) {
        console.log("object:", object);
        var user_room = "user_" + object.sender_id;
        socket.join(user_room);
        console.log("user_room:", user_room);
        socket.emit("connected");   // by video 15 
        get_messages(object, function (response) {
            if (response.length > 0) {
                console.log("get_messages has been successfully executed...");
                io.to(user_room).emit('response', { object_type: "get_messages", data: response });
            } else {
                console.log("get_messages has been failed...");
                io.to(user_room).emit('response', { object_type: "get_messages", message: [] });
            }
        });
    });

    // SEND MESSAGE EMIT                                                                                             
    socket.on('send_message', async function (object) {
        console.log("object:", object);
        var sender_room = "user_" + object.sender_id;
        var receiver_room = "user_" + object.receiver_id;
        send_message(object, function (response_obj) {
            if (response_obj) {
                console.log("send_message has been successfully executed...");
                // io.to(sender_room).to(receiver_room).emit('response', { object_type: "get_message", data: response_obj });
                // socket.broadcast.emit('message', 'this is a test');
                // socket.broadcast.emit('message', { user: data.user, msg: data.msg });
                socket.broadcast.emit('response', { object_type: "get_message", data: response_obj });
            } else {
                console.log("send_message has been failed...");
                // io.to(sender_room).to(receiver_room).emit('response', { object_type: "get_message", message: "There is some problem in get_message..." });
                // socket.broadcast.emit('message', 'this is a test');
                // socket.broadcast.emit('message', { user: data.user, msg: data.msg });
                socket.broadcast.emit('response', { object_type: "get_message", message: "There is some problem in get_message..." });
            }
        });
    });

});






const PORT = process.env.PORT || 3000; app.listen(PORT, () => { console.log(`App listening on port ${PORT}!`); });
