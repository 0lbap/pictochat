const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

var roomA = [];
var roomB = [];
var roomC = [];
var roomD = [];

app.get("/", (request, response) => {
  response.sendFile("public/index.html", { root: __dirname });
});

app.get("/public/:fileName", (request, response) => {
  response.sendFile("public/" + request.params.fileName, { root: __dirname });
});

http.listen(8000, () => {
  console.log("Écoute sur le port 8000");
});


io.on("connection", (socket) => {
  console.log("\x1b[32m%s\x1b[0m", "> " + socket.id + " s'est connecté");

  socket.on("joinRoom", (roomId, pseudo, couleur) => {
    console.log(pseudo + " joined room " + roomId);
    // On enleve le socket.id des rooms où il était déjà
    for(let i=0; i<roomA.length; i++) {
      if(roomA[i].id == socket.id) {
        roomA.splice(i,1);
        socket.leave("roomA");
      }
    }
    for(let i=0; i<roomB.length; i++) {
      if(roomB[i].id == socket.id) {
        roomB.splice(i,1);
        socket.leave("roomB");
      }
    }
    for(let i=0; i<roomC.length; i++) {
      if(roomC[i].id == socket.id) {
        roomC.splice(i,1);
        socket.leave("roomC");
      }
    }
    for(let i=0; i<roomD.length; i++) {
      if(roomD[i].id == socket.id) {
        roomD.splice(i,1);
        socket.leave("roomD");
      }
    }
    // On lui assigne sa nouvelle room
    switch(roomId) {
      case "A":
        roomA.push({id: socket.id, pseudo: pseudo, couleur: couleur});
        socket.join("roomA");
        io.in("roomA").emit("joining", pseudo, couleur);
        io.in("roomA").emit("refreshPpl", roomA);
        break;
      case "B":
        roomB.push({id: socket.id, pseudo: pseudo, couleur: couleur});
        socket.join("roomB");
        io.in("roomB").emit("joining", pseudo);
        io.in("roomB").emit("refreshPpl", roomB);
        break;
      case "C":
        roomC.push({id: socket.id, pseudo: pseudo, couleur: couleur});
        socket.join("roomC");
        io.in("roomC").emit("joining", pseudo);
        io.in("roomC").emit("refreshPpl", roomC);
        break;
      case "D":
        roomD.push({id: socket.id, pseudo: pseudo, couleur: couleur});
        socket.join("roomD");
        io.in("roomD").emit("joining", pseudo);
        io.in("roomD").emit("refreshPpl", roomD);
        break;
    }
    // On affiche toutes les rooms
    console.log("Room A :");
    console.log(roomA);
    console.log("Room B :");
    console.log(roomB);
    console.log("Room C :");
    console.log(roomC);
    console.log("Room D :");
    console.log(roomD);
  });

  socket.on("disconnect", () => {
    console.log("\x1b[31m%s\x1b[0m", "< " + socket.id + " s'est déconnecté");
    // On enleve le socket.id des rooms où il était déjà
    for(let i=0; i<roomA.length; i++) {
      if(roomA[i].id == socket.id) {
        io.in("roomA").emit("sysmsg", "Now leaving [A]", roomA[i].pseudo);
        roomA.splice(i,1);
        io.in("roomA").emit("refreshPpl", roomA);
        socket.leave("roomA");
      }
    }
    for(let i=0; i<roomB.length; i++) {
      if(roomB[i].id == socket.id) {
        io.in("roomB").emit("sysmsg", "Now leaving [B]", roomB[i].pseudo);
        roomB.splice(i,1);
        io.in("roomB").emit("refreshPpl", roomB);
        socket.leave("roomB");
      }
    }
    for(let i=0; i<roomC.length; i++) {
      if(roomC[i].id == socket.id) {
        io.in("roomC").emit("sysmsg", "Now leaving [C]", roomC[i].pseudo);
        roomC.splice(i,1);
        io.in("roomC").emit("refreshPpl", roomC);
        socket.leave("roomC");
      }
    }
    for(let i=0; i<roomD.length; i++) {
      if(roomD[i].id == socket.id) {
        io.in("roomD").emit("sysmsg", "Now leaving [D]", roomD[i].pseudo);
        roomD.splice(i,1);
        io.in("roomD").emit("refreshPpl", roomD);
        socket.leave("roomD");
      }
    }
  });

  // SENDING MSG
  socket.on("sendmsg", (msg) => {
    for(let i=0; i<roomA.length; i++) {
      if(roomA[i].id == socket.id) {
        io.to("roomA").emit("msg", roomA[i].pseudo, roomA[i].couleur, msg);
      }
    }
    for(let i=0; i<roomB.length; i++) {
      if(roomB[i].id == socket.id) {
        io.to("roomB").emit("msg", roomB[i].pseudo, roomB[i].couleur, msg);
      }
    }
    for(let i=0; i<roomC.length; i++) {
      if(roomC[i].id == socket.id) {
        io.to("roomC").emit("msg", roomC[i].pseudo, roomC[i].couleur, msg);
      }
    }
    for(let i=0; i<roomD.length; i++) {
      if(roomD[i].id == socket.id) {
        io.to("roomD").emit("msg", roomD[i].pseudo, roomD[i].couleur, msg);
      }
    }
  });

  // SENDING DRAWING
  socket.on("senddrawing", (drawing) => {
    for(let i=0; i<roomA.length; i++) {
      if(roomA[i].id == socket.id) {
        io.to("roomA").emit("drawing", roomA[i].pseudo, roomA[i].couleur, drawing);
      }
    }
    for(let i=0; i<roomB.length; i++) {
      if(roomB[i].id == socket.id) {
        io.to("roomB").emit("drawing", roomB[i].pseudo, roomB[i].couleur, drawing);
      }
    }
    for(let i=0; i<roomC.length; i++) {
      if(roomC[i].id == socket.id) {
        io.to("roomC").emit("drawing", roomC[i].pseudo, roomC[i].couleur, drawing);
      }
    }
    for(let i=0; i<roomD.length; i++) {
      if(roomD[i].id == socket.id) {
        io.to("roomD").emit("drawing", roomD[i].pseudo, roomD[i].couleur, drawing);
      }
    }
  });

  // EDITING PROFILE
  socket.on("edit_profile", (newpseudo, newcouleur) => {
    for(let i=0; i<roomA.length; i++) {
      if(roomA[i].id == socket.id) {
        roomA[i].pseudo = newpseudo;
        roomA[i].couleur = newcouleur;
      }
    }
    for(let i=0; i<roomB.length; i++) {
      if(roomB[i].id == socket.id) {
        roomB[i].pseudo = newpseudo;
        roomB[i].couleur = newcouleur;
      }
    }
    for(let i=0; i<roomC.length; i++) {
      if(roomC[i].id == socket.id) {
        roomC[i].pseudo = newpseudo;
        roomC[i].couleur = newcouleur;
      }
    }
    for(let i=0; i<roomD.length; i++) {
      if(roomD[i].id == socket.id) {
        roomD[i].pseudo = newpseudo;
        roomD[i].couleur = newcouleur;
      }
    }
  });

  // GETTING NUMBER OF PEOPLE IN ALL ROOMS
  socket.on("reqNbPpl", () => {
    socket.emit("resNbPpl", {roomA: roomA.length, roomB: roomB.length, roomC: roomC.length, roomD: roomD.length});
  });

  // GETTING ARRAY OF PEOPLE IN A ROOM
  socket.on("reqPplInRoom", (roomId) => {
    switch(roomId) {
      case "A":
        socket.emit("refreshPpl", roomA);
      case "B":
        socket.emit("resPplInRoom", roomB);
      case "C":
        socket.emit("resPplInRoom", roomC);
      case "D":
        socket.emit("resPplInRoom", roomD);
    }
  });
});
