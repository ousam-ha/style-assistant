const chatContainer = document.getElementById('chat-container');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function addMessageToChat(message, isUser = false) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.classList.add(
    'message',
    isUser ? 'user-message' : 'bot-message'
  );
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
}

sendButton.addEventListener('click', async () => {
  const message = messageInput.value;
  if (message) {
    addMessageToChat(message, true); // Add user message
    messageInput.value = '';

    try {
      const response = await fetch('/get-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      addMessageToChat(data.response); // Add bot response
    } catch (error) {
      console.error(error);
      addMessageToChat('Oops, something went wrong.');
    }
  }
});
