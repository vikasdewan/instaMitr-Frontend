import React, { forwardRef, useState, useImperativeHandle,useRef} from "react";
import { Button } from "./ui/button";
import { Video, PhoneOff, PhoneIncoming } from "lucide-react";

const VideoCallModal = forwardRef(({ callState, currentUser, selectedUser, socket, onEndCall }, ref) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" }
    ]
  };

  useImperativeHandle(ref, () => ({
    showIncomingCall: () => {
      // Already handled by parent component
    },
    startCall: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection(iceServers);
        setPeerConnection(pc);

        // Add local tracks
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });

        // Handle remote tracks
        pc.ontrack = (event) => {
          if (event.streams && event.streams[0] && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setRemoteStream(event.streams[0]);
          }
        };

        // ICE candidate handling
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              callId: callState.callId,
              to: callState.isCalling ? selectedUser._id : callState.callerInfo.id,
              candidate: event.candidate
            });
          }
        };

        if (callState.isCalling) {
          // Create offer if we're the caller
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          socket.emit("webrtc-offer", {
            callId: callState.callId,
            to: selectedUser._id,
            offer
          });
        }

      } catch (error) {
        console.error("Error starting call:", error);
        onEndCall();
      }
    },
    endCall: () => {
      if (peerConnection) {
        peerConnection.close();
        setPeerConnection(null);
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        setLocalStream(null);
      }
      setRemoteStream(null);
      onEndCall();
    }
  }));

  const acceptCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const pc = new RTCPeerConnection(iceServers);
      setPeerConnection(pc);

      // Add local tracks
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Handle remote tracks
      pc.ontrack = (event) => {
        if (event.streams && event.streams[0] && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStream(event.streams[0]);
        }
      };

      // ICE candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            callId: callState.callId,
            to: callState.callerInfo.id,
            candidate: event.candidate
          });
        }
      };

      socket.emit("call-response", {
        callId: callState.callId,
        accepted: true
      });
    } catch (error) {
      console.error("Error accepting call:", error);
      onEndCall();
    }
  };

  const rejectCall = () => {
    socket.emit("call-response", {
      callId: callState.callId,
      accepted: false
    });
    onEndCall();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center ${(callState.isCalling || callState.isReceivingCall) ? 'block' : 'hidden'}`}>
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl">
        {/* Call header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {callState.isCalling ? `Calling ${selectedUser?.username}` : 
             callState.isReceivingCall ? `Incoming call from ${callState.callerInfo?.name}` : ''}
          </h2>
        </div>

        {/* Video feeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover aspect-video"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
              You
            </div>
          </div>
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover aspect-video"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
              {callState.isCalling ? selectedUser?.username : callState.callerInfo?.name}
            </div>
          </div>
        </div>

        {/* Call controls */}
        <div className="flex justify-center gap-4">
          {callState.isReceivingCall && !callState.isCalling && (
            <>
              <Button
                onClick={acceptCall}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full"
              >
                <PhoneIncoming className="mr-2" /> Accept
              </Button>
              <Button
                onClick={rejectCall}
                className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full"
              >
                <PhoneOff className="mr-2" /> Reject
              </Button>
            </>
          )}
          {(callState.isCalling || remoteStream) && (
            <Button
              onClick={() => {
                socket.emit("call-end", { callId: callState.callId });
                onEndCall();
              }}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-full"
            >
              <PhoneOff className="mr-2" /> End Call
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});

VideoCallModal.displayName = "VideoCallModal";

export default VideoCallModal;