const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use('/static', express.static('public'))



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let currentMsg = [];

for (let i = 1; i < 17; i++) {
  currentMsg.push(`${i}`)
}
currentMsg = shuffle(currentMsg);


io.on('connection', (socket) => {
  console.log('a user connected');
  if (checkWin(currentMsg)) {
    socket.emit("win", "you won");
  }
  socket.emit("update", currentMsg);
  socket.on("update", (msg) => {
    console.log("smh")
    currentMsg = msg;
    socket.broadcast.emit("update", msg);
    if (checkWin(msg)) {
      //emit win event
      
      io.emit("win", "you won bish");
    }
  })
  socket.on("shuffle", (msg) => {
    if (msg == "shishu123") {
      currentMsg = shuffle(currentMsg);
      io.emit("update", currentMsg);
    }

  })
});


server.listen(3000, () => {
  console.log('listening on *:3000');
});

function checkWin(array) {
  
  let newarray = [];
  for (let i = 1; i < 17; i++) {
    newarray.push(`${i}`)
  }
  console.log(array, newarray)
  if (JSON.stringify(newarray) == JSON.stringify(array)) {
    console.log("win")
    return true
  } else {
    return false
  }
}
function shuffle(array) {
  var currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}