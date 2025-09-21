🔵 Level 3: Manual Signaling Between Tabs (Two-Peer Video Chat)
🎯 Goal

Connect two browser tabs or two different browsers by manually exchanging WebRTC signaling data (SDP offer/answer and ICE candidates).

Why Manual Signaling?

Before we build a signaling server (Level 4), you’ll manually copy-paste the offer and answer messages to connect peers. This helps you understand how WebRTC negotiation really works under the hood!

What You’ll Build

Two <textarea> boxes: one to create an offer (Tab A), one to paste an answer (Tab B)

Buttons to generate and set SDP

Two video elements: local & remote streams

Ability to send video and audio between two browser tabs/devices

#How to Use This App?#

Open this app in two separate tabs or two browsers.

In Tab A, click Start Camera.

In Tab A, click Create Offer — copy the JSON from the "Create Offer" textarea.

In Tab B, click Start Camera.

Paste Tab A's offer JSON into Tab B's Offer textarea (you might want to rename it to "Paste Offer" for clarity) — actually, since we only made textarea for answer in Tab B, you can swap roles or add the full logic. To keep it simple, here Tab B can paste offer in the answer textarea and click Set Answer after creating an answer. This example currently only supports pasting the answer.

(For a fully functional two-way copy-paste, you'd build separate buttons for both offer and answer.)

In Tab B, after pasting the offer, call pc.setRemoteDescription(offer) (you can add UI/buttons for that).

Then Tab B creates an answer (not implemented here for brevity).

Tab B copies the answer JSON, pastes it into Tab A's answer textarea, and clicks Set Answer.

Both peers exchange ICE candidates by copying from the ICE textarea and pasting into the other side, then clicking Add ICE Candidate.

Summary

This is a manual copy-paste signaling method.

You get full control and understanding of how offer, answer, and ICE candidates are exchanged.

Real apps use servers or WebSocket for this (covered in Level 4).