document.addEventListener('DOMContentLoaded', () => {
    const inputElement = document.getElementById('user-input');
    const sendButton = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    // Function to handle sending a message
    async function sendMessage() {
        const message = inputElement.value.trim();

        if (!message) return;

        // Add user message to chat history
        chatMessages.innerHTML += `<div class="user" style="font-size: 14px;margin: 7px; border-radius: 4px;padding : 4px; position: relative;color : #1F2023; justify-content: right;background-color : #FFE5C1;">${message}</div> <br> <br>`;

        // Send message to backend
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const result = await response.json();
            const botMessage = result.text;

            // Add bot message to chat history
            chatMessages.innerHTML += `<div class="model" style="font-size: 14px;margin: 7px; border-radius: 4px;position: relative; padding : 4px; color : #7f4b3c; justify-content: left;background-color : #FFE5C1;">AI : ${botMessage}</div> <br> <br>`;
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
        } catch (error) {
            console.error('Error sending message:', error);
        }

        // Clear the input field
        inputElement.value = '';
    }

    // Event listener for the send button
    sendButton.addEventListener('click', sendMessage);

    // Event listener for the Enter key in the textarea
    inputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent the default action (e.g., newline in textarea)
            sendMessage();
        }
    });
});

function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    if (chatBody.style.display === 'none' || chatBody.style.display === '') {
        chatBody.style.display = 'flex'; // Show the chat body
        chatBody.style.bottom = '100%'; // Position above the header
    } else {
        chatBody.style.display = 'none'; // Hide the chat body
    }
}
