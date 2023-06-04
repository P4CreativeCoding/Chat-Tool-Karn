const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const requiredPassword = "HALLO";

// Statische Dateien im "public" Verzeichnis bereitstellen
app.use(express.static("public"));

// Farben für User
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

// Online-Benutzerliste
const onlineUsers = [];

// WebSocket-Verbindung herstellen
io.on("connection", function (socket) {
  console.log("Neue Verbindung hergestellt");
  console.log("Das Passwort lautet: 1234");
  socket.on("login", function (data) {
    const password = data.password;

    if (password !== requiredPassword) {
      // Passwort ist nicht korrekt
      socket.emit("loginError", "Falsches Passwort");
      return;
    }

    // Pop-up-Fenster schließen
    socket.emit("closeLoginPopup");
  });

  // Nickname für den Benutzer speichern
  socket.on("nickname", function (nickname) {
    if (nickname.length > 25) {
      // Nickname ist zu lang
      socket.emit(
        "nicknameError",
        "Der Nickname darf nicht mehr als 25 Zeichen haben."
      );
      return;
    }

    console.log("Nickname empfangen: " + nickname);
    socket.nickname = nickname; // Nickname im Socket speichern
    onlineUsers.push(nickname); // Benutzer zur Online-Benutzerliste hinzufügen
    io.emit("userLogin", onlineUsers); // Online-Benutzerliste an alle Sockets senden
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

  // Verbindung trennen
  socket.on("disconnect", function () {
    console.log("Verbindung getrennt");
    if (socket.nickname) {
      const index = onlineUsers.indexOf(socket.nickname);
      if (index !== -1) {
        onlineUsers.splice(index, 1); // Benutzer aus der Online-Benutzerliste entfernen
        io.emit("userLogout", onlineUsers); // Aktualisierte Online-Benutzerliste an alle Sockets senden
      }
    }
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
