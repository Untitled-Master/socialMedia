let peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;
let placeholderImgSrc = ''; // Path to your placeholder image

let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    remoteStream = new MediaStream();
    document.getElementById('user-1').srcObject = localStream;
    document.getElementById('user-2').srcObject = remoteStream;
    document.getElementById('user-1').muted = true;  // Mute the local video element to avoid echo
    document.getElementById('user-1').poster = placeholderImgSrc; // Set placeholder image

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };
};

let createOffer = async () => {
    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

let createAnswer = async () => {
    let offer = JSON.parse(document.getElementById('offer-sdp').value);

    peerConnection.onicecandidate = async (event) => {
        if (event.candidate) {
            document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription);
        }
    };

    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

let addAnswer = async () => {
    let answer = JSON.parse(document.getElementById('answer-sdp').value);
    if (!peerConnection.currentRemoteDescription) {
        await peerConnection.setRemoteDescription(answer);
    }
};

let toggleTrack = (trackType, buttonId) => {
    let enabled = false;
    localStream.getTracks().forEach((track) => {
        if (track.kind === trackType) {
            track.enabled = !track.enabled;
            enabled = track.enabled;
        }
    });

    const button = document.getElementById(buttonId);
    const videoPlayer = document.getElementById('user-1');
    if (!enabled) {
        button.classList.remove('is-primary');
        button.classList.add('is-danger');
    } else {
        button.classList.remove('is-danger');
        button.classList.add('is-primary');
    }
};

document.getElementById('microphone').addEventListener('click', () => toggleTrack('audio', 'microphone'));
document.getElementById('camera').addEventListener('click', () => toggleTrack('video', 'camera'));
document.getElementById('sharescreen').addEventListener('click', async () => {
    let screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    let screenTrack = screenStream.getVideoTracks()[0];
    peerConnection.getSenders().forEach((sender) => {
        if (sender.track.kind === 'video') {
            sender.replaceTrack(screenTrack);
        }
    });

    screenTrack.onended = () => {
        let videoTrack = localStream.getVideoTracks()[0];
        peerConnection.getSenders().forEach((sender) => {
            if (sender.track.kind === 'video') {
                sender.replaceTrack(videoTrack);
            }
        });
    };
});

init();

document.getElementById('create-offer').addEventListener('click', createOffer);
document.getElementById('create-answer').addEventListener('click', createAnswer);
document.getElementById('add-answer').addEventListener('click', addAnswer);
