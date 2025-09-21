## 🟢 LEVEL 1: Get Camera & Microphone

### 🎯 Goal:
**Show your camera video on the page**

---

### ✅ Code Example (HTML + JS)

```
<html>
<!DOCTYPE html>
<html>
<head>
  <title>WebRTC Camera</title>
</head>
<body>
  <h1>My Camera</h1>
  <video id="myVideo" autoplay playsinline></video>

  <script>
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      document.getElementById('myVideo').srcObject = stream;
    }

    startCamera();
  </script>
</body>
</html>
```

### 🧪 Exercise 1:

- ✅ Try turning on **only video**, not audio  
  > 💡 Replace `{ video: true, audio: true }` with `{ video: true }`

- ✅ Show both **camera and microphone tracks** in the console:

```
console.log(stream.getTracks());
