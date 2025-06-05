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
    let chats = [];

    function updateChatUI(username) {
        if (username) {
            currentUsername = username;
            loginForm?.classList.add('hidden');
            chatWrapper?.classList.remove('hidden');
            if (welcomeUserB) {
                welcomeUserB.textContent = username;
            }
            // Focus the message input when entering chat
            if (usermsgInput) {
                usermsgInput.focus();
            }
        } else {
            currentUsername = null;
            loginForm?.classList.remove('hidden');
            chatWrapper?.classList.add('hidden');
            if (welcomeUserB) {
                welcomeUserB.textContent = '';
            }
            if (nameInput) {
                nameInput.value = '';
                nameInput.focus(); // Focus the name input when returning to login
            }
        }
    }

    function formatTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }

    function addMessageToUI(messageDetails) {
        if (!chatbox || !messageDetails?.username || !messageDetails?.chatMessage) {
            console.error('Invalid message details:', messageDetails);
            return;
        }

        const chatDiv = document.createElement('div');
        chatDiv.classList.add('chat');
        
        const chatContent = document.createElement('span');
        chatContent.innerHTML = `
            <strong style="color: #ff9800">${messageDetails.username}</strong>
            <span style="color: #666"> • ${formatTimestamp()}</span><br>
            ${messageDetails.chatMessage}
        `;
        
        chatDiv.appendChild(chatContent);
        chatbox.appendChild(chatDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    function loadChats() {
        try {
            const storedChats = localStorage.getItem('chats');
            chats = storedChats ? JSON.parse(storedChats) : [];
            
            if (!Array.isArray(chats)) chats = [];
            
            if (chatbox) {
                chatbox.innerHTML = '';
                chats.forEach(chat => {
                    if (typeof chat === 'string') {
                        addMessageToUI({ 
                            username: "Anonymous (old)", 
                            chatMessage: chat 
                        });
                    } else if (chat?.chatMessage && chat?.username) {
                        addMessageToUI(chat);
                    }
                });
            }
        } catch (e) {
            console.error("Error loading chats:", e);
            chats = [];
        }
    }

    function handleMessageSubmit() {
        if (!usermsgInput) return;
        
        const chatMessage = usermsgInput.value.trim();
        if (chatMessage && currentUsername) {
            const newMessage = { 
                username: currentUsername, 
                chatMessage,
                timestamp: new Date().toISOString()
            };
            
            addMessageToUI(newMessage);
            chats.push(newMessage);
            localStorage.setItem('chats', JSON.stringify(chats));
            usermsgInput.value = '';
        }
    }

    // Event Listeners
    loginActionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = nameInput?.value.trim();
        if (name) {
            localStorage.setItem('username', name);
            updateChatUI(name);
            loadChats();
        }
    });

    exitButton?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('username');
        updateChatUI(null);
    });

    submitButton?.addEventListener('click', handleMessageSubmit);

    usermsgInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleMessageSubmit();
        }
    });

    // Initial setup
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        updateChatUI(storedUsername);
        loadChats();
    } else {
        updateChatUI(null);
    }
});