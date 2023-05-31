const socket = io();
let pseudo = "anonyme";
let couleur = "#99C7E8";
let room = null;

window.onload = function() {
  console.log("Bienvenue sur Pictochat !");

  socket.emit("reqNbPpl");
  socket.on("resNbPpl", (tailleDe) => {
    $("#join-A").text("Chat Room A (" + tailleDe.roomA + "/16)");
    $("#join-B").text("Chat Room B (" + tailleDe.roomB + "/16)");
    $("#join-C").text("Chat Room C (" + tailleDe.roomC + "/16)");
    $("#join-D").text("Chat Room D (" + tailleDe.roomD + "/16)");
  });

  $("#edit_profile").on("click", () => {
    if($("#pseudo").val() != "") {
      pseudo = $("#pseudo").val();
      $("#pseudo").val("");
    }
    if($("#couleur").val() != "") {
      couleur = $("#couleur").val();
      $("#couleur").val(couleur);
    }
    socket.emit("edit_profile", pseudo, couleur);
    console.log("Profil modifié : ");
    console.log("pseudo=" + pseudo + ",couleur=" + couleur);
  });

  $("#join-A").on("click", () => {
    room = "A";
    joinRoom("A");
  });

  $("#join-B").on("click", () => {
    room = "B";
    joinRoom("B");
  });

  $("#join-C").on("click", () => {
    room = "C";
    joinRoom("C");
  });

  $("#join-D").on("click", () => {
    room = "D";
    joinRoom("D");
  });
}

function joinRoom(roomId) {
  console.log("Joining room " + roomId);
  socket.emit("joinRoom", roomId, pseudo, couleur);
  showChat();
}

function showChat() {
  $("body").empty();
  let html = "";
  html+='<div id="connectedUsersContainer"><ul id="connectedUsers"></ul></div>';
  html+='<div id="chat"></div>';
  html+='<div id="msg-bar">';
  html+='<svg id="drawing"></svg>';
  html+='<br/>';
  html+='<input id="msg" type="text" placeholder="Votre message...">';
  html+='<button id="send">Envoyer</button>';
  html+='<br/>';
  html+='<button onclick="$(\'#chat\').empty()">Vider le tchat</button>';
  html+='<button onclick="$(\'#drawing\').empty()">Supprimer le dessin</button>';
  html+='</div>';
  $("body").append(html);
  $("#send").on("click", () => {
    if($("#drawing").children().length > 0) {
      let svgString = exportSVG();
      $("#drawing").empty();
      console.log("Sending drawing");
      socket.emit("senddrawing", svgString);
    }
    if($("#msg").val() != "") {
      let msg = $("#msg").val();
      $("#msg").val("");
      console.log("Sending message '" + msg + "'");
      socket.emit("sendmsg", msg);
    }
  });

  html = "";
  html += '<div class="msg-block" style="border: 1px solid white; background-color: gray">';
  html += '<span class="msg-pseudo" style="color: lightgray">PICTOCHAT</span>';
  html += '</div>';
  $("#chat").append(html);
  
  const svg = d3.select("#drawing");

  let isDrawing = false;
  let startX, startY;

  svg
    .on("mousedown", (event) => {
      isDrawing = true;
      startX = event.offsetX;
      startY = event.offsetY;
    })
    .on("mouseup", () => {
      isDrawing = false;
    })
    .on("mousemove", (event) => {
      if (isDrawing) {
        const currentX = event.offsetX;
        const currentY = event.offsetY;

        svg
          .append("line")
          .attr("x1", startX)
          .attr("y1", startY)
          .attr("x2", currentX)
          .attr("y2", currentY)
          .style("stroke", "black")
          .style("stroke-width", 2);

        startX = currentX;
        startY = currentY;
      }
    });
  
  function exportSVG() {
    const svgString = $("#drawing").html();
    return svgString;
  }

  socket.on("msg", (pseudo, couleur, msg) => {
    showMsg(pseudo, couleur, msg);
  });

  socket.on("drawing", (pseudo, couleur, drawing) => {
    showDrawing(pseudo, couleur, drawing);
  });

  socket.on("sysmsg", (title, msg) => {
    showSysMsg(title, msg);
  });

  socket.on("joining", (pseudo, couleur) => {
    let html = '<li>';
    html += '<span class="carre" style="background-color:' + couleur + ';"></span>';
    html += pseudo;
    html += '</li>';
    $("#connectedUsers").append(html);
    showSysMsg("Now entering [" + room + "]", pseudo);
  });

  socket.on("refreshPpl", (users) => {
    $("#connectedUsers").empty();
    for(let i=0; i<users.length; i++) {
      let html = '<li>';
      html += '<span class="carre" style="background-color:' + users[i].couleur + ';"></span>';
      html += users[i].pseudo;
      html += '</li>';
      $("#connectedUsers").append(html);
    }
  });
}

function showMsg(pseudo, couleur, msg) {
  let html = '<div class="msg-block" style="border: 1px solid ' + couleur + '">';
  html += '<span class="msg-pseudo" style="background-color:' + couleur + ';">' + pseudo + '</span>';
  html += '<span class="msg-content">' + msg + '</span>';
  html += '</div>';
  $("#chat").append(html);
  document.getElementById("chat").scrollTo(0,document.getElementById("chat").scrollHeight);
}

function showDrawing(pseudo, couleur, drawing) {
  let html = '<div class="msg-block" style="border: 1px solid ' + couleur + '">';
  html += '<span class="msg-pseudo" style="background-color:' + couleur + ';">' + pseudo + '</span>';
  html += '<svg>' + drawing + '</svg>';
  html += '</div>';
  $("#chat").append(html);
  document.getElementById("chat").scrollTo(0,document.getElementById("chat").scrollHeight);
}

function showSysMsg(title, msg) {
  let html = '<div class="msg-block" style="border: 1px solid white; background-color: black">';
  html += '<span class="msg-pseudo" style="color: yellow">' + title + ':</span>';
  html += '<span class="msg-content" style="color: white">' + msg + '</span>';
  html += '</div>';
  $("#chat").append(html);
  document.getElementById("chat").scrollTo(0,document.getElementById("chat").scrollHeight);
}
