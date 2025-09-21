## 🔴 Level 4: Signaling Server with WebSocket — Real-Time Two-Peer WebRTC Chat

### 🎯 Goal

Build a signaling server using **WebSocket** to exchange WebRTC signaling data (offer, answer, ICE candidates) automatically.

- Connect two browsers/tabs without manual copy-pasting.
- Make a working 1-on-1 video chat app!

---

### Why Signaling Server?

WebRTC peers need to exchange **Session Description Protocol (SDP)** and **ICE candidates** to establish a connection. Since WebRTC does not define how this data is exchanged, a signaling mechanism is required.

In Level 3, we did manual copy-pasting. Now, we automate it with a signaling server.

---

### 🧱 What You’ll Build

- A Node.js WebSocket server (using `ws` library)  
- A simple client HTML/JS app connecting to that server  
- Two peers exchanging SDP and ICE messages via WebSocket  
- Real-time video chat with **no manual message copying**

---

### Tech Stack

- Node.js for signaling server  
- WebSocket (`ws` package)  
- Plain HTML + JavaScript frontend

## Step-by-Step Instructions

### ✅ Step 1: Setup Signaling Server

Create a new folder, e.g. `webrtc-signaling-server`, then create `server.js`:


paste the below code

```js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients = [];

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.push(ws);

  ws.on('message', (message) => {
    // Broadcast message to other clients
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter(client => client !== ws);
  });
});

console.log('Signaling server running on ws://localhost:8080');


### ✅ Step 2: Run the Server

Make sure you have Node.js installed. Then run the following commands in your terminal:

```bash
npm init -y
npm install ws
node server.js
```

You should see:
```bash
Signaling server running on ws://localhost:8080
```

### ✅ Step 3: Create Frontend HTML (`index.html`)

```html
<!DOCTYPE html>
<html>
<head>
  <title>WebRTC with WebSocket Signaling</title>
  <style>
    video {
      width: 300px;
      margin: 10px;
      border: 2px solid #333;
    }
  </style>
</head>
<body>
  <h1>WebRTC + WebSocket Signaling</h1>

  <video id="localVideo" autoplay playsinline muted></video>
  <video id="remoteVideo" autoplay playsinline></video>

  <button id="startBtn">Start Camera & Connect</button>

  <script src="main.js"></script>
</body>
</html>


### ✅ Step 4: Client JavaScript (`main.js`)

```js
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


## How to Test

1. **Run the signaling server:**

```bash
node server.js
Serve your frontend files via any local server (e.g., Live Server VSCode extension or Python's built-in HTTP server):

```bash
python -m http.server 5500
Open two browser tabs or two different browsers pointing to your frontend URL, for example:

http://localhost:5500

Click “Start Camera & Connect” on both tabs.

The two tabs should connect automatically and show each other's video!