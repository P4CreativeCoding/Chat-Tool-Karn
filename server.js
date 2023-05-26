const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

// API-Route
app.use("/api", require("./api/index"));

// Statische Dateien und andere Routen
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Server starten
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});
