const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

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

  // Farbe für den Benutzer auswählen
  const userColor = colors[Math.floor(Math.random() * colors.length)];

  // Farbzuordnung speichern
  userColors[socket.id] = userColor;

  // Ereignis abonnieren: Nachricht senden
  socket.on("message", function (message) {
    console.log("Nachricht empfangen: " + message);
    console.log(userColor);
    // Nachricht an alle anderen verbundenen Sockets senden
    io.emit("message", {
      message: message,
      color: userColors[socket.id],
    });
  });
});

// Server starten
http.listen(3000, function () {
  console.log(
    "Server gestartet. Öffne http://localhost:3000 in einem Webbrowser."
  );
});
