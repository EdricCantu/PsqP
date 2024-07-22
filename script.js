const localOffer = document.getElementById('localOffer');
const remoteOffer = document.getElementById('remoteOffer');
const connectButton = document.getElementById('connect');
const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');
const messagesDiv = document.getElementById('messages');

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

let localConnection = new RTCPeerConnection(configuration);
let dataChannel = localConnection.createDataChannel('chat');

dataChannel.onmessage = (event) => {
    const message = document.createElement('div');
    message.textContent = `Remote: ${event.data}`;
    messagesDiv.appendChild(message);
};

sendButton.onclick = () => {
    const message = messageInput.value;
    dataChannel.send(message);
    const messageElement = document.createElement('div');
    messageElement.textContent = `You: ${message}`;
    messagesDiv.appendChild(messageElement);
    messageInput.value = '';
};

localConnection.onicecandidate = (event) => {
    if (event.candidate) {
        localOffer.value = JSON.stringify(localConnection.localDescription);
    }
};

connectButton.onclick = async () => {
    const remoteDescription = new RTCSessionDescription(JSON.parse(remoteOffer.value));
    await localConnection.setRemoteDescription(remoteDescription);
    if (remoteDescription.type === 'offer') {
        const answer = await localConnection.createAnswer();
        await localConnection.setLocalDescription(answer);
        localOffer.value = JSON.stringify(localConnection.localDescription);
    }
};

(async () => {
    const offer = await localConnection.createOffer();
    await localConnection.setLocalDescription(offer);
    localOffer.value = JSON.stringify(localConnection.localDescription);
})();
