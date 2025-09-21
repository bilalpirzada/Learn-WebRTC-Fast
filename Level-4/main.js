
let localStream;
let pc;
let ws;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startBtn = document.getElementById('startBtn');

startBtn.onclick = async () => {
  startBtn.disabled = true;

  // 1. Get local media
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  // 2. Connect to WebSocket signaling server
  ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
    console.log('Connected to signaling server');
    startWebRTC();
  };

  ws.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.sdp) {
      console.log('Received SDP:', data.sdp.type);
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (data.sdp.type === 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        sendMessage({ sdp: pc.localDescription });
      }
    } else if (data.candidate) {
      console.log('Received ICE candidate');
      try {
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (e) {
        console.error('Error adding received ICE candidate', e);
      }
    }
  };
};

function sendMessage(message) {
  ws.send(JSON.stringify(message));
}

async function startWebRTC() {
  pc = new RTCPeerConnection();

  // Send any ICE candidates to the other peer
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendMessage({ candidate: event.candidate });
    }
  };

  // When remote stream arrives, show it in remoteVideo
  pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  // Add local tracks to peer connection
  localStream.getTracks().forEach(track => {
    pc.addTrack(track, localStream);
  });

  // Create offer and send it
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  sendMessage({ sdp: pc.localDescription });
}