document.addEventListener("DOMContentLoaded", function () {
  // Verbindung zum WebSocket-Server herstellen
  const socket = io();

  // HTML-Elemente abrufen
  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const styleSelect = document.getElementById("style-select");
  const styleSheet = document.getElementById("style-sheet");

  // Ereignis abonnieren: Nachricht empfangen
  socket.on("message", function (data) {
    const message = data.message;
    const color = data.color;
    const timestamp = getCurrentTime(); // Aktuellen Zeitstempel abrufen
    displayMessage(message, color, timestamp);
  });

  // Ereignis abonnieren: Senden-Button geklickt
  // Ereignis abonnieren: Senden-Button geklickt
  sendButton.addEventListener("click", function () {
    const message = messageInput.value;
    if (message.trim() !== "") {
      socket.emit("message", message);
      messageInput.value = "";
    }
  });

  // Ereignis abonnieren: Stil auswählen
  styleSelect.addEventListener("change", function () {
    const selectedStyle = styleSelect.value;
    styleSheet.href = `${selectedStyle}.css`;
  });

  // Nachricht im Chat anzeigen
  function displayMessage(message, color, timestamp) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.style.color = color; // Textfarbe setzen

    const timestampElement = document.createElement("div");
    timestampElement.classList.add("timestamp");
    timestampElement.textContent = timestamp;

    const contentElement = document.createElement("span");
    contentElement.textContent = message;

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
