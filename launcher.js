const video = document.querySelector('#destvid');
const video1 = document.querySelector('#peervid');
var destid = document.getElementById("destid");
var connecteddiv = document.getElementById("connecteddiv");
var connectiondiv = document.getElementById("connectiondiv");
var connectbutton = document.getElementById("connectbutton");
var inputmessage = document.getElementById("inputmessage");
var recievermsg = document.getElementById("recievermsg");
var peerId = null;
var conn = null;
var peer = null;
const constraints = {
    audio: true,
    video: {
        width:500,
        height: 500
    }
};

function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported by your browser');
}

function notEmpty(string) {
    return !(string.length === 0 || !string.trim());
}

function initialize() {
    peer = new Peer({
         host:'peerjs-server.herokuapp.com', secure:true, port:443,
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
initialize();

function go() {
    navigator.mediaDevices.getUserMedia(constraints).
    then((stream) => {
        //so that i dont hear my voice repeated   :P
        video1.muted = true;
        video1.srcObject = stream;
            console.log(video1);

        connecteddiv.style.display = "grid";
        destid.style.display = "none";
        connectbutton.innerHTML = "Connected";
        connectbutton.disabled = "disabled";
        connectbutton.style.backgroundColor = "#0D2C3E";
        var call = peer.call(destid.value, stream);
        call.on('stream', function(remoteStream) {
            video.srcObject = remoteStream;
        });
        conn = peer.connect(destid.value);
        conn.on('open', function() {
            sendandrecieve();
        });
    });
}