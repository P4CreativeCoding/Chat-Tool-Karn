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

  // Ereignis abonnieren: Nickname-Formular senden
  nicknameForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const enteredNickname = nicknameInput.value.trim(); // Eingegebenen Nickname ohne Leerzeichen abrufen

    if (enteredNickname !== "") {
      nickname = enteredNickname;
      socket.emit("nickname", nickname); // Nickname an den Server senden
      messageInput.focus();
      nicknameForm.style.display = "none";
    } else {
      // Fehlermeldung anzeigen, wenn kein Nickname eingegeben wurde
      alert("Bitte gib einen Nickname ein.");
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

  // Ereignis abonnieren: Stil auswählen
  styleSelect.addEventListener("change", function () {
    const selectedStyle = styleSelect.value;
    styleSheet.href = `${selectedStyle}.css`;
  });

  // Nachricht im Chat anzeigen
  function displayMessage(message, color, sender, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.style.color = color;

    const senderElement = document.createElement("div");
    senderElement.classList.add("sender");
    senderElement.textContent = sender;

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
});
