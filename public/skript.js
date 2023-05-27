document.addEventListener("DOMContentLoaded", function () {
  // Verbindung zum WebSocket-Server herstellen
  const socket = io();

  // HTML-Elemente abrufen
  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const styleSelect = document.getElementById("style-select");
  const styleSheet = document.getElementById("style-sheet");

  //Nickname abrufen
  const nicknameInput = document.getElementById("nickname-input");
  const nicknameForm = document.getElementById("nickname-form");

  let nickname = "";

  // Ereignis abonnieren: Nachricht empfangen
  socket.on("message", function (data) {
    const message = data.message; // Eigenschaft des Objekts abrufen
    const color = data.color;
    const timestamp = getCurrentTime();
    const sender = data.nickname || "Anonymous";
    displayMessage(message, color, sender, timestamp);
  });

  // Ereignis abonnieren: Nickname senden
  document
    .getElementById("nickname-form")
    .addEventListener("submit", function (e) {
      e.preventDefault(); // Standardformular-Verhalten verhindern
      const nickname = nicknameInput.value.trim();
      if (nickname.length > 25) {
        // Zu langer Nickname
        alert("Der Nickname darf maximal 25 Zeichen lang sein.");
        nicknameInput.value = ""; // Eingabefeld leeren
      } else {
        // Nickname senden
        socket.emit("nickname", nickname);
        nicknameInput.disabled = true; // Eingabefeld deaktivieren
      }
    });

  // Ereignis abonnieren: Senden-Button geklickt
  sendButton.addEventListener("click", function () {
    const message = messageInput.value.trim();
    const enteredNickname = nicknameInput.value.trim();

    if (message !== "" && enteredNickname !== "") {
      const data = {
        message: message,
        nickname: enteredNickname,
      };

      socket.emit("message", data);
      messageInput.value = "";
    } else {
      // Fehlermeldung anzeigen, wenn Nachricht oder Nickname leer sind
      alert("Bitte gib eine Nachricht ein und wähle einen Nickname aus.");
    }
  });

  // Fehlermeldung anzeigen
  function displayErrorMessage(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  // Ereignis abonnieren: Nickname-Fehler
  socket.on("nicknameError", function (errorMessage) {
    // Fehlermeldung anzeigen
    alert(errorMessage);
  });

  // Ereignis abonnieren: Stil auswählen
  styleSelect.addEventListener("change", function () {
    const selectedStyle = styleSelect.value;
    styleSheet.href = `${selectedStyle}.css`;
  });

  // Nachricht im Chat anzeigen
  function displayMessage(message, color, sender, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const senderElement = document.createElement("div");
    senderElement.classList.add("sender");
    senderElement.style.color = color; // Farbe nur auf den Nicknamen anwenden
    senderElement.textContent = sender;
    senderElement.style.fontWeight = "bold";

    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = timestamp;

    const contentElement = document.createElement("span");
    contentElement.textContent = message;

    messageElement.appendChild(senderElement);
    messageElement.appendChild(timestampElement);
    messageElement.appendChild(contentElement);
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Aktuellen Zeitstempel abrufen
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const timestamp = `${hours}:${minutes}`;
    return timestamp;
  }

  // Online-Benutzerliste aktualisieren
  socket.on("userLogin", function (onlineUsers) {
    updateUserList(onlineUsers);
  });

  socket.on("userLogout", function (onlineUsers) {
    updateUserList(onlineUsers);
  });

  // Funktion zum Aktualisieren der Online-Benutzerliste
  function updateUserList(onlineUsers) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    onlineUsers.forEach(function (user) {
      const listItem = document.createElement("li");
      listItem.innerText = user;
      userList.appendChild(listItem);
    });
  }
});
