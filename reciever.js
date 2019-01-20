var peer = null;
const video = document.querySelector('#destvid');
const video1 = document.querySelector('#peervid');
const connectbutton = document.querySelector('#connectbutton');
const idtext = document.querySelector('#idtext');
var peerId = null;
var destid = null;
const constraints = {
    audio: true,
    video: {
        width: {
            min: 200,
            ideal: 500,
            max: 1920
        },
        height: {
            min: 200,
            ideal: 500,
            max: 1080
        }
    }
};




function notEmpty(string) {
    return !(string.length === 0 || !string.trim());
}

function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported by your browser');
}

function sendandrecieve() {
    conn.on('data', function(data) {
        recievermsg.innerHTML = "<div class='messages'><p class='sentmsg'>" + data + "</p></div>" + recievermsg.innerHTML;
    });
    sendbutton.onclick = function() {
        if (notEmpty(inputmessage.value)) {
            conn.send(inputmessage.value);
            recievermsg.innerHTML = "<div class='messager'><p class='recievedmsg'>" + inputmessage.value + "</p></div>" + recievermsg.innerHTML;
            inputmessage.value = "";
        }
    };
    inputmessage.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        sendbutton.click();
      }
    });
}

function initialize() {
    //peer = new Peer (); 
    peer = new Peer({
        config: {
            'iceServers': [{
                    url: 'stun:stun01.sipphone.com'
                },
                {
                    url: 'stun:stun.ekiga.net'
                },
                {
                    url: 'stun:stun.fwdnet.net'
                },
                {
                    url: 'stun:stun.ideasip.com'
                },
                {
                    url: 'stun:stun.iptel.org'
                },
                {
                    url: 'stun:stun.rixtelecom.se'
                },
                {
                    url: 'stun:stun.schlund.de'
                },
                {
                    url: 'stun:stun.l.google.com:19302'
                },
                {
                    url: 'stun:stun1.l.google.com:19302'
                },
                {
                    url: 'stun:stun2.l.google.com:19302'
                },
                {
                    url: 'stun:stun3.l.google.com:19302'
                },
                {
                    url: 'stun:stun4.l.google.com:19302'
                },
                {
                    url: 'stun:stunserver.org'
                },
                {
                    url: 'stun:stun.softjoys.com'
                },
                {
                    url: 'stun:stun.voiparound.com'
                },
                {
                    url: 'stun:stun.voipbuster.com'
                },
                {
                    url: 'stun:stun.voipstunt.com'
                },
                {
                    url: 'stun:stun.voxgratia.org'
                },
                {
                    url: 'stun:stun.xten.com'
                },
                {
                    'url': 'turn:numb.viagenie.ca',
                    'credential': 'muazkh',
                    'username': 'webrtc@live.com'
                },
                {
                    'url': 'turn:192.158.29.39:3478?transport=udp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                },
                {
                    'url': 'turn:192.158.29.39:3478?transport=tcp',
                    'credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    'username': '28224511:1379330808'
                }
            ]
        }
    });
    peer.on('open', function(id) {
        peerId = id;
        idtext.innerHTML = "My ID is  : " + id;
        console.log('ID: ' + id);
    });
    peer.on('error', function(err) {
        if (err.type === 'unavailable-id') {
            alert('' + err);
            peer.reconnect();
        } else
            alert('' + err);
    });
};
initialize();
peer.on('open', function() {
    peer.on('call', function(call) {
        navigator.mediaDevices.getUserMedia(constraints).
        then((stream) => {
            destid = call.peer;
            video1.muted = true;
            video1.srcObject = stream;
            call.answer(stream);
            call.on('stream', function(remoteStream) {
                video.srcObject = remoteStream;
                idtext.style.display = "none";
                connectbutton.style.display = "block";
                connectbutton.style.backgroundColor = "#0D2C3E";
            });
        });
    });
    peer.on('connection', function(c) {
        conn = c;
        conn.on('open', function() {
            sendandrecieve();
        });
    });
});