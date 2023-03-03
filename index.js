
let chats = JSON.parse(localStorage.getItem('chats'));
console.log(chats)
if(chats === null) chats = []
if(chats) {
	chats.map((item) => {
		AddChats(item.chatMessage);
	})
}
function AddChats(chatmsg) {
	let chatbot = document.getElementById('chatbox');
	let chat = document.createElement('div');
	chat.classList.add('chat')

	let chatContent = document.createElement('span');
	chatContent.innerHTML = `Anonymous - ${chatmsg}`;

	chat.appendChild(chatContent);
	chatbot.appendChild(chat);

	console.log(JSON.parse(localStorage.getItem('chats')))
}


document.getElementById('submitButton').addEventListener('click', () => {
	let chatInput = document.getElementById('usermsg');
	AddChats(chatInput.value)
	chats.push({chatMessage: chatInput.value});
	chatInput.value = "";
	localStorage.setItem('chats', JSON.stringify(chats))
	location.reload();
})