const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");

// Statische Dateien im "public" Verzeichnis bereitstellen
app.use(express.static("public"));

//Farben
const colors = [
  "#bd2b20",
  "#bdad20",
  "#418219",
  "#19826f",
  "#194a82",
  "#2e1982",
  "#6d1982",
  "#000000",
];
const userColors = {};

// WebSocket-Verbindung herstellen
io.on("connection", function (socket) {
  console.log("Neue Verbindung hergestellt");

  // Nickname für den Benutzer speichern
  socket.on("nickname", function (nickname) {
    console.log("Nickname empfangen: " + nickname);
    socket.nickname = nickname; // Nickname im Socket speichern
  });

  // Farbe für den Benutzer auswählen
  const userColor = colors[Math.floor(Math.random() * colors.length)];

  // Farbzuordnung speichern
  userColors[socket.id] = userColor;

  // Ereignis abonnieren: Nachricht senden
  socket.on("message", function (data) {
    console.log("Nachricht empfangen: " + data.message);
    console.log("Nickname: " + data.nickname);
    console.log("Farbe: " + userColors[socket.id]);
    // Nachricht an alle anderen verbundenen Sockets senden
    io.emit("message", {
      message: data.message,
      color: userColors[socket.id],
      nickname: data.nickname,
    });
  });
});

// Standardroute
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
const port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log(
    "Server gestartet. Öffne http://localhost:" + port + " in einem Webbrowser."
  );
});
