## 🟡 Level 2: WebRTC Loopback – Step-by-Step Guide

### 🎯 Goal:
Simulate a real-time WebRTC video call between two peers inside the same browser tab — no server, just a **loopback connection**.

---

### 📚 What You’ll Learn:

- How to use `getUserMedia()` to access your **webcam**
- How to set up two `RTCPeerConnection` objects
- How to **send video** between the two connections
- How to exchange **offer**, **answer**, and **ICE candidates**

### 📦 Files and Structure

***You only need two files:***
- webrtc-loopback/
  -  /index.html
  -  /main.js

## 🧱 Step-by-Step Instructions

### ✅ Step 1: Basic HTML Setup

Create a file named `index.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebRTC Loopback</title>
  <style>
    video {
      width: 300px;
      margin: 10px;
      border: 2px solid #333;
    }
  </style>
</head>
<body>
  <h1>WebRTC Loopback</h1>

  <!-- Local stream -->
  <video id="localVideo" autoplay playsinline muted></video>

  <!-- Remote stream (looped back) -->
  <video id="remoteVideo" autoplay playsinline></video>

  <!-- Start button -->
  <button onclick="start()">Start Loopback</button>

  <!-- Link to JavaScript -->
  <script src="main.js"></script>
</body>
</html>
```

### ✅ Step 2: JavaScript Setup (`main.js`)

Create a file named `main.js` and follow the steps below.

---

### 📸 Step 3: Get Access to Camera

```
let localStream;

const localVideo = document.getElementById('localVideo');

async function start() {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false // set to true to include mic
  });

  localVideo.srcObject = localStream;

  // ... more steps below
}
```

### 🧠 Step 4: Create Two Peer Connections

Create two `RTCPeerConnection` instances:

```
let pc1 = new RTCPeerConnection();
let pc2 = new RTCPeerConnection();
```

### 🎥 Step 5: Send Local Stream to First Peer (`pc1`)

Add the local media tracks to the first peer connection:

```
localStream.getTracks().forEach(track => {
  pc1.addTrack(track, localStream);
});
```

### 🖥️ Step 6: Receive Remote Stream on Second Peer (`pc2`)

Set up the second peer to receive and display the remote stream:

```
const remoteVideo = document.getElementById('remoteVideo');

pc2.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

### 🔁 Step 7: ICE Candidate Exchange (Network Info)

Exchange ICE candidates between the two peer connections:

```
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
```

### 🔄 Step 8: Offer and Answer Exchange

Exchange session descriptions between the peers:

```
const offer = await pc1.createOffer();
await pc1.setLocalDescription(offer);
await pc2.setRemoteDescription(offer);

const answer = await pc2.createAnswer();
await pc2.setLocalDescription(answer);
await pc1.setRemoteDescription(answer);
```

## 🧪 Optional Challenges

1. **Enable Audio**

   Change `audio: false` to `audio: true` in `getUserMedia()` — but **wear headphones** to avoid feedback.

2. **Add Connection State Logs**

```
pc1.onconnectionstatechange = () => {
  console.log('pc1 state:', pc1.connectionState);
};

pc2.onconnectionstatechange = () => {
  console.log('pc2 state:', pc2.connectionState);
};
```

3. **Stop the Stream**

Add a button to stop the media stream and the following function:

```
function stop() {
  localStream.getTracks().forEach(track => track.stop());
}
```
