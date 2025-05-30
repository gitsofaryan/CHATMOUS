
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginform');
    const chatWrapper = document.getElementById('wrapper');
    const loginActionForm = document.getElementById('loginFormAction');
    const nameInput = document.getElementById('name');
    const exitButton = document.getElementById('exit');
    const welcomeUserB = document.querySelector('#menu .welcome b');
    const chatbox = document.getElementById('chatbox');
    const usermsgInput = document.getElementById('usermsg');
    const submitButton = document.getElementById('submitButton');

    let currentUsername = null;
    let chats = []; // Local cache of chat messages, will be populated from localStorage

    // Function to update UI based on login state
    function updateChatUI(username) {
        if (username) {
            currentUsername = username;
            if (loginForm) loginForm.classList.add('hidden');
            if (chatWrapper) chatWrapper.classList.remove('hidden');
            if (welcomeUserB) {
                welcomeUserB.textContent = username;
            }
        } else {
            currentUsername = null;
            if (loginForm) loginForm.classList.remove('hidden');
            if (chatWrapper) chatWrapper.classList.add('hidden');
            if (welcomeUserB) {
                welcomeUserB.textContent = '';
            }
            if (nameInput) {
                nameInput.value = ''; // Clear name input on logout
            }
        }
    }

    // Updated AddChats function to handle message objects
    function addMessageToUI(messageDetails) {
        if (!chatbox || !messageDetails || !messageDetails.hasOwnProperty('username') || !messageDetails.hasOwnProperty('chatMessage')) {
            console.error('Chatbox or message details invalid:', chatbox, messageDetails);
            return;
        }
        let chatDiv = document.createElement('div');
        chatDiv.classList.add('chat');
        let chatContent = document.createElement('span');
        chatContent.textContent = `${messageDetails.username} - ${messageDetails.chatMessage}`;
        chatDiv.appendChild(chatContent);
        chatbox.appendChild(chatDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Function to load chats from localStorage and display them
    function loadChats() {
        const storedChats = localStorage.getItem('chats');
        if (storedChats) {
            try {
                chats = JSON.parse(storedChats);
                if (!Array.isArray(chats)) chats = [];
            } catch (e) {
                console.error("Error parsing chats from localStorage:", e);
                chats = [];
            }
        } else {
            chats = [];
        }
        if (chatbox) chatbox.innerHTML = ''; // Clear existing messages

        chats.forEach(chat => {
            // Adapt old string messages to new object format if necessary
            if (typeof chat === 'string') {
                addMessageToUI({ username: "Anonymous (old)", chatMessage: chat });
            } else if (chat && chat.hasOwnProperty('chatMessage') && chat.hasOwnProperty('username')) {
                addMessageToUI(chat);
            }
        });
    }

    // Event Listener for login form submission
    if (loginActionForm) {
        loginActionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!nameInput) return;
            const name = nameInput.value.trim();
            if (name) {
                localStorage.setItem('username', name);
                updateChatUI(name);
                loadChats(); // Load chats for the logged-in user
            } else {
                console.log("Username cannot be empty");
            }
        });
    }

    // Event Listener for logout button
    if (exitButton) {
        exitButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('username');
            updateChatUI(null);
            if (chatbox) chatbox.innerHTML = ''; // Clear chatbox on logout
            chats = []; // Clear local chats array
            // Consider clearing localStorage chats: localStorage.removeItem('chats');
            // This would make chats non-persistent across different user logins.
            // For now, chats are technically "shared" if different users log in on the same browser.
        });
    }

    // submitButton listener (updated)
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            if (!usermsgInput) return;
            const chatInputValue = usermsgInput.value.trim();
            if (chatInputValue && currentUsername) {
                const newMessage = { username: currentUsername, chatMessage: chatInputValue };
                addMessageToUI(newMessage);

                chats.push(newMessage); // Add to local cache
                localStorage.setItem('chats', JSON.stringify(chats)); // Save all chats (includes old and new)

                usermsgInput.value = '';
            } else if (!currentUsername) {
                console.log("Please log in to send messages.");
                // Optionally, alert the user or disable the input/button if not logged in
            }
        });
    }

    // Initial setup on page load
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        updateChatUI(storedUsername);
        loadChats();
    } else {
        updateChatUI(null);
        if (chatbox) chatbox.innerHTML = '';
    }
});