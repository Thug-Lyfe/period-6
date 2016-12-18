'use strict'
var express = require("express");
var app = express();

let voting = {
  results: [0,0],
  title: "Do you like beer?",
  yesTxt: "Yes",
  noTxt: "No, i prefer milk"
}

app.use(express.static(__dirname+"/public"));

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3000;
var ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var server = app.listen(port,ip,()=>{
  console.log(`Server started, listening on port: ${port}, bound to ${ip}`)
});

var io = require("socket.io")(server);

io.on("connection",(socket)=>{
  console.log("A user Connected!")
  socket.emit("setup",voting);

  socket.on("disconnect",()=>{
    console.log("A user Disconnected")
  })
  socket.on("vote",(vote)=>{
    console.log("Got a Vote")
    vote.value ? voting.results[0]++: voting.results[1]++;
    io.emit("update",voting.results);
  })

})
