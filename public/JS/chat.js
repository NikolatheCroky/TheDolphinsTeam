const socket = io('http://localhost:3050'),
messageForm = document.getElementById('send-container'),
messageInput = document.getElementById('msg-field'),
messageContainer = document.getElementById('message-container')
let name = window.prompt('Влезте в профила си' + '\n \n' + 'Въведете вашето потребителско име.'),
password = window.prompt('Въведете вашата парола.'),
login = false,
roles,
messages = []


if(name === null || name === ''){
    window.alert('Грешно име и/или парола.')
    window.location.replace('http://localhost:3000/chat')
}

socket.emit('login-attempt', [name, password])

socket.on('login-return', data => {
    if(data[0] = name){
        if(data[1] === true){
            login = true;
            console.log('login-attempt true')
            roles = data[2]
        }

        if(data[1] === false){
            console.log('login-attempt false')
            return window.location.replace('http://localhost:3000/chat')
        }
    }
})

if(login = true){

    //Requesting a message lsit of the last 20 messages in the database
    socket.emit('message-list-request', '')

    //Catching the responce to a 'message-list-request' request and appending each message of the list
    socket.on('message-list-responce', list => {
        for(var i = 0; i < list.length; i++){
            appendMessage(list[i])
        }
    })

    //Catching a chat-message event and append that message
    socket.on('chat-message', data => {
        appendMessage(data);
    })

    //Sending a message
    messageForm.addEventListener('submit', e => {
        e.preventDefault();
        const message = messageInput.value
        socket.emit('send-chat-message', [name, message])
        messageInput.value = ''
    })

    //Message deleted catch
    socket.on('message-deleted', e => {
        disAppendMessage(e)
    })

    //Message edited catch
    socket.on('message-edited', e => {
        editMessage(e)
    })
}


//Apending a Message
function appendMessage(message) {
    const messageElement = document.createElement('div')
    
    messageElement.innerHTML = '<img class="user-avatar" id="' + 'message-avatar-' + messages.length +'"' + ' src="' + message[2] + '">' + message[0] + ':  ' + message[1]// + '\n <br> \n <a class="message-id">' + messages.length + '</a>'
    messageElement.setAttribute('id', messages.length.toString())
    messageContainer.append(messageElement)
    messages.push({
        senderUn: message[0],
        content: message[1],
        senderAvatarURL:  message[2],
        ID: message[3]
    })
}

//Apending a Client Side only (CSo) message
function appendCSoMessage(message) {
    const messageElement = document.createElement('div')
    messageElement.innerText = message
    messageContainer.append(messageElement);
}

//Disappending a message
function disAppendMessage(messageID){
    messageContainer.removeChild(messageContainer.getElementById(messageID))
    messages.splice(messages.indexOf(messages.find(message => message.ID = messageID)), 1)
}

//Editing a message
function editMessage(messageID, edit) {
    let messageVar = messages.find(message => message.ID === messageID)
    console.log(messageVar)
    messageVar.content = edit
    let message = document.getElementById(messageID)
    message.innerHTML = '<img class="user-avatar" id="' + 'message-avatar-' + messages.length +'"' + ' src="' + messageVar.senderAvatarURL + '">' + messageVar.senderUn + ': ' + edit + '\n <br> \n <a class="message-id">' + messageID + '</a>'
}

/** Unused code
 * socket.emit('message-del', msgID)
 * socket.emit('message-edit', [msgID, edit])
 * 
 * 
 * 
 * 
 * 
 * 
 */