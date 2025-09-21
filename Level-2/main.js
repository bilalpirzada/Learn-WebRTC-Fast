let localStream;
let pc1;
let pc2;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

async function start() {
  // 1. Get media from camera
  localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  localVideo.srcObject = localStream;

  // 2. Create peer connections
  pc1 = new RTCPeerConnection();
  pc2 = new RTCPeerConnection();

  // 3. Set up remote video
  pc2.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
  };

  // 4. Add local stream tracks to pc1
  localStream.getTracks().forEach((track) => {
    pc1.addTrack(track, localStream);
  });

  // 5. ICE candidates
  pc1.onicecandidate = (e) => {
    if (e.candidate) {
      pc2.addIceCandidate(e.candidate);
    }
  };

  pc2.onicecandidate = (e) => {
    if (e.candidate) {
      pc1.addIceCandidate(e.candidate);
    }
  };

  // 6. Offer/Answer
  const offer = await pc1.createOffer();
  await pc1.setLocalDescription(offer);
  await pc2.setRemoteDescription(offer);

  const answer = await pc2.createAnswer();
  await pc2.setLocalDescription(answer);
  await pc1.setRemoteDescription(answer);
}
