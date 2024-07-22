//https://jsfiddle.net/jib1/nnc13tw2/
iceSercers = 
  (await (await fetch("https://gist.githubusercontent.com/mondain/b0ec1cf5f60ae726202e/raw/2d2b96b4508a38d342e0228d46eab84dad2398a3/public-stun-list.txt")).text())
  .split("\n").map(url=>({ url: "stun:"+url }));
var dc, pc = new RTCPeerConnection({ iceServers});
pc.onaddstream = e => v2.srcObject = e.stream;
pc.ondatachannel = e => dcInit(dc = e.channel);
pc.oniceconnectionstatechange = e => log(pc.iceConnectionState);

var haveGum = navigator.mediaDevices.getUserMedia({video:true, audio:true})
  .then(stream => pc.addStream(v1.srcObject = stream)).catch(log);

function dcInit() {
  dc.onopen = () => log("Chat!");
  dc.onmessage = e => log(e.data);
}

function createOffer() {
  button.disabled = true;
  dcInit(dc = pc.createDataChannel("chat"));
  haveGum.then(() => pc.createOffer()).then(d => pc.setLocalDescription(d))
    .catch(log);
  pc.onicecandidate = e => {
    if (e.candidate) return;
    offer.value = pc.localDescription.sdp;
    offer.select();
    answer.placeholder = "Paste answer here";
  };
};

offer.onkeypress = e => {
  if (!enterPressed(e) || pc.signalingState != "stable") return;
  button.disabled = offer.disabled = true;
  var desc = new RTCSessionDescription({ type:"offer", sdp:offer.value });
  pc.setRemoteDescription(desc)
    .then(() => pc.createAnswer()).then(d => pc.setLocalDescription(d))
    .catch(log);
  pc.onicecandidate = e => {
    if (e.candidate) return;
    answer.focus();
    answer.value = pc.localDescription.sdp;
    answer.select();
  };
};

answer.onkeypress = e => {
  if (!enterPressed(e) || pc.signalingState != "have-local-offer") return;
  answer.disabled = true;
  var desc = new RTCSessionDescription({ type:"answer", sdp:answer.value });
  pc.setRemoteDescription(desc).catch(log);
};

chat.onkeypress = e => {
  if (!enterPressed(e)) return;
  dc.send(chat.value);
  log(chat.value);
  chat.value = "";
};

var enterPressed = e => e.keyCode == 13;
var log = msg => div.innerHTML += "<p>" + msg + "</p>";
