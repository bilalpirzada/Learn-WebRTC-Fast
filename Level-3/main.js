let localStream;
let pc;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const startBtn = document.getElementById('startBtn');
const createOfferBtn = document.getElementById('createOfferBtn');
const setAnswerBtn = document.getElementById('setAnswerBtn');
const addIceBtn = document.getElementById('addIceBtn');

const offerSdpTextarea = document.getElementById('offerSdp');
const answerSdpTextarea = document.getElementById('answerSdp');
const iceCandidatesTextarea = document.getElementById('iceCandidates');

startBtn.onclick = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  localVideo.srcObject = localStream;

  pc = new RTCPeerConnection();

  // Add local tracks to peer connection
  localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

  // When remote tracks arrive, show them
  pc.ontrack = event => {
    remoteVideo.srcObject = event.streams[0];
  };

  // Collect ICE candidates and show them for manual copying
  pc.onicecandidate = event => {
    if (event.candidate) {
      iceCandidatesTextarea.value += JSON.stringify(event.candidate) + '\n';
    }
  };

  alert('Camera started, you can now create an offer.');
};

createOfferBtn.onclick = async () => {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  offerSdpTextarea.value = JSON.stringify(pc.localDescription);
};

setAnswerBtn.onclick = async () => {
  const answer = JSON.parse(answerSdpTextarea.value);
  await pc.setRemoteDescription(answer);
  alert('Remote answer set. Connection should start.');
};

addIceBtn.onclick = async () => {
  const candidates = iceCandidatesTextarea.value.trim().split('\n');
  for (const candidateStr of candidates) {
    if (!candidateStr) continue;
    try {
      const candidate = new RTCIceCandidate(JSON.parse(candidateStr));
      await pc.addIceCandidate(candidate);
    } catch (e) {
      console.error('Error adding ICE candidate', e);
    }
  }
  alert('ICE candidates added.');
};
